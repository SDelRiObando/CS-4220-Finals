import express from 'express';
import db from '../services/db.js';

const router = express.Router();

// POST /history?type=keywords or type=selections
router.post('/', async (req, res) => {
    const { type } = req.query;  // Get the 'type' query parameter
    const { keyword, searchTerms, slug } = req.body;  // Get body data
  
    // Validate 'type'
    if (!type || (type !== 'keywords' && type !== 'selections')) {
      return res.status(400).json({
        error: "Invalid or missing 'type'. Must be 'keywords' or 'selections'.",
      });
    }
  
    // Validate body based on 'type'
    if (type === 'keywords' && (!keyword || !searchTerms)) {
      return res.status(400).json({
        error: "'keyword' and 'searchTerms' are required for type='keywords'.",
      });
    }
  
    if (type === 'selections' && !slug) {
      return res.status(400).json({
        error: "'slug' is required for type='selections'.",
      });
    }
  
    try {
      if (type === 'keywords') {
        const document = { keyword, searchTerms };

        // Check if this keyword + searchTerms combo already exists
        const cursor = await db.find('search_history', document);
        const existing = await cursor.toArray();
      
        if (existing.length > 0) {
          // Duplicate found: skip saving, but don't throw an error
          return res.status(200).json({ message: 'Duplicate entry skipped.' });
        }
      
        await db.insert('search_history', document);
        return res.status(201).json({ message: 'Keyword search saved.' });
      }
  
      if (type === 'selections') {
        const document = { keyword, slug };
        await db.insert('search_history_selection', document);
        return res.status(201).json({ message: 'Selection saved.' });
      }
    } catch (err) {
      console.error('Error in POST /history:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });  

// GET /history - To fetch all history
router.get('/', async (req, res) => {
    try {
      console.log('Fetching history...');
  
      // Use your custom db.find wrapper, which returns a cursor
      const keywordCursor = await db.find('search_history');
      const selectionCursor = await db.find('search_history_selection');
  
      const keywordHistory = await keywordCursor.toArray();
      const selectionHistory = await selectionCursor.toArray();
  
      console.log('Keyword History:', keywordHistory);
      console.log('Selection History:', selectionHistory);
  
      if (keywordHistory.length === 0 && selectionHistory.length === 0) {
        return res.status(404).json({ message: 'No history found.' });
      }
  
      res.json({ keywordHistory, selectionHistory });
    } catch (error) {
      console.error('Error fetching history:', error.message);
      res.status(500).json({ error: 'Server error while fetching history.' });
    }
  });  
  
export default router;