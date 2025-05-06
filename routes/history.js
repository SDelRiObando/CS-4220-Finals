import express from "express";
import db from "../services/db.js";

const router = express.Router();

// POST /history gotta implement ?type=keywords or ?type=selections
router.post("/", async (req, res) => {
	const { type } = req.query; // Get the 'type' query parameter
	const { keyword, searchTerms, slug } = req.body; // Get body data

	// Validate 'type'
	if (!type || (type !== "keywords" && type !== "selections")) {
		return res.status(400).json({
			error: "Invalid or missing 'type'. Must be 'keywords' or 'selections'.",
		});
	}

	// Validate body based on 'type'
	if (type === "keywords" && (!keyword || !searchTerms)) {
		return res.status(400).json({
			error: "'keyword' and 'searchTerms' are required for type='keywords'.",
		});
	}

	if (type === "selections" && !slug) {
		return res.status(400).json({
			error: "'slug' is required for type='selections'.",
		});
	}

	try {
		if (type === "keywords") {
			const document = { keyword, searchTerms };

			// Check if this keyword + searchTerms combo already exists
			const cursor = await db.find("search_history", document);
			const existing = await cursor.toArray();

			if (existing.length > 0) {
				// Duplicate found: skip saving, but don't throw an error
				return res
					.status(200)
					.json({ message: "Duplicate entry skipped." });
			}

			await db.insert("search_history", document);
			return res.status(201).json({ message: "Keyword search saved." });
		}

		if (type === "selections") {
			const document = { keyword, slug };
			await db.insert("search_history_selection", document);
			return res.status(201).json({ message: "Selection saved." });
		}
	} catch (err) {
		console.error("Error in POST /history:", err.message);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// GET /history - To fetch all history
router.get("/", async (req, res) => {
	const { type } = req.query; // Get the 'type' query parameter
	const TYPE_OPTIONS = ["keywords", "selections"];

	// Checks if type query exists. And validates if the type is either 'keywords' or 'selections'
	if (!type || !TYPE_OPTIONS.includes(type)) {
		return res.status(404).json({
			message:
				"'type' query string required. Available types: ['keywords', 'selections'].",
		});
	}

	try {
		// Grabs the cursor depending on the history its fetching.
		let cursor;
		if (type == "keywords") {
			cursor = await db.find("search_history");
		} else if (type == "selections") {
			cursor = await db.find("search_history_selection");
		}

		// In case cursor fails to fetch.
		if (!cursor) {
			throw new Error("Failed to fetch history cursor from MongoDB.");
		}

		// Parsing cursor data to array object.
		const history = await cursor.toArray();

		// Request was successful, however no content.
		if (history.length === 0) {
			return res.status(204).json({ message: "No history found." });
		}

		// Remove the MongoDB '_id' field from all selections
		const results = history.map((selection) => {
			delete selection["_id"];
			return selection;
		});

		res.json(results);
	} catch (error) {
		console.error("Error fetching history:", error.message);
		res.status(500).json({
			error: "Server error while fetching history.",
		});
	}
});

export default router;
