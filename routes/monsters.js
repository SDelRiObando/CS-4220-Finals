import express from 'express';
import { searchByKeyword, getDataByKeywordAndSlug} from '../services/api.js';
import db from '../services/db.js';
import axios from 'axios';

const router = express.Router();

// GET /monsters?q=dragons
router.get('/', async (req, res) => {
  const searchTerm = req.query.q;
  const page = parseInt(req.query.page) || 1;

  if (!searchTerm) {
    return res.status(400).json({ error: "Missing required query parameter 'search term'" });
  }

  try {
    // Use the searchByKeyword helper from api.js
    const { results, next, previous } = await searchByKeyword('monsters', searchTerm, page);

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({ message: `No monsters found for "${searchTerm}"` });
    }

    // Save only the search term (e.g., "dragons") to the /history route (for keywords)
    const searchHistory = {
      keyword: "monsters",  
      searchTerms: [searchTerm], 
    };

    // Send the search history to the /history endpoint for keywords
    await axios.post('http://localhost:5000/history?type=keywords', searchHistory);

    // Format the results for frontend use
    const cleanResults = results.map(monster => ({
      display: monster.name,
      identifier: monster.slug,
      _id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    }));

    res.json({ results: cleanResults, next, previous });
  } catch (error) {
    console.error('Error in GET /monsters:', error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

//Tony
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Get the 'id' (slug) from the path
  const keyword = 'monsters'; 

  try {
      // Step 1: Fetch data using the `getDataByKeywordAndSlug` function
      const data = await getDataByKeywordAndSlug(keyword, id);

      // Step 2: Check if this selection already exists in the database
      const existingSelectionCursor = await db.find('search_history_selection', { keyword, slug: id });
  
      const existingSelection = await existingSelectionCursor.toArray();
      
      // Step 3: If no existing selection, save it to MongoDB
      if (existingSelection.length === 0) {
          const selectionDocument = { keyword, slug: id };  // Save selection
          await db.insert('search_history_selection', selectionDocument);
      }

      // Step 4: Return the fetched data as JSON
      res.json(data);
  } catch (error) {
      console.error('Error in GET /monsters/:id:', error.message);
      res.status(500).json({ error: 'Server error while fetching data.' });
  }
});

export default router;