import express from 'express';
import { searchByKeyword, getDataByKeywordAndSlug} from '../services/api.js';
import db from '../services/db.js';
import axios from 'axios';

const router = express.Router();

// GET /monsters?search=dragons&page=1
router.get('/', async (req, res) => {
  const searchTerm = req.query.search;

  if (!searchTerm) {
    return res.status(400).json({ error: "Missing required query parameter 'search'" });
  }
  
  if (!req.query.page) {
    // Redirect to add page=1 if missing
    return res.redirect(`${req.path}monsters?search=${searchTerm}&page=1`);
  }

  const page = parseInt(req.query.page);
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid 'page' parameter, must be a positive integer" });
  }

  try {
    const { results, next, previous } = await searchByKeyword('monsters', searchTerm, page);

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({ message: `No monsters found for "${searchTerm}"` });
    }

    // Save search history by POSTing to /history
    try {
      await axios.post('http://localhost:8080/history?type=keywords', {
        keyword: 'monsters',
        searchTerms: [searchTerm],
      });
    } catch (historyError) {
      // Log but don't block main response
      console.error('Failed to save search history:', historyError.message);
    }

    const cleanResults = results.map(monster => ({
      display: monster.name,
      identifier: monster.slug,
      _id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    }));

    res.json({ results: cleanResults, next, previous });
  } catch (error) {
    console.error('Error in GET /monsters:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

//Tony
// GET /monsters/slug
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Get the 'id' (slug) from the path
  const keyword = 'monsters';

  try {
    // Step 1: Fetch data using the `getDataByKeywordAndSlug` function
    const data = await getDataByKeywordAndSlug(keyword, id);

    // Step 2: Check if this selection already exists in the database
    const existingSelectionCursor = await db.find('search_history_selection', { keyword, slug: id });
    const existingSelection = await existingSelectionCursor.toArray();

    // Step 3: If no existing selection, save it via POST to /history?type=selections
    if (existingSelection.length === 0) {
      try {
        await axios.post('http://localhost:8080/history?type=selections', {
          keyword,
          slug: id,
        });
      } catch (historyError) {
        console.error('Failed to save selection history:', historyError.message);
      }
    }

    // Step 4: Return the fetched data as JSON
    res.json(data);
  } catch (error) {
    console.error('Error in GET /monsters/:id:', error.message);
    res.status(500).json({ error: 'Server error while fetching data.' });
  }
});

export default router;