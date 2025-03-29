import { getDataByKeyword, getDataByKeywordAndSlug } from "./api.js";
import { select } from "@inquirer/prompts";
import { insert, find } from "./db.js";

/**
 * Searches the selected API using the provided keyword.
 * Saves the keyword to search_history_keyword.json if it is unique.
 * Displays a list of search results in a user-friendly format.
 * Saves the selected item to search_history_selection.json if it is unique.
 * Retrieves and displays detailed information for the selected item.
 *
 * @param {string} keyword - The keyword to search for in the selected API.
 */

/// Searches for a type of selection Monster/spell/class
export const searchApiByKeyword = async (keyword) => {
  try {
    const results = await getDataByKeyword(keyword.toLowerCase());

    // Extract slugs
    const slugs = results.map((item) => ({
      name: item.name,
      value: item.slug,
    }));

    // Display options
    const selectedSlug = await select({
      message: "Select one of the following options:",
      choices: slugs,
    });

    // Display Item/specific monster
    searchApiByKeywordAndSelection(keyword, selectedSlug);

    // Save Keywords and selections
    saveKeywordToHistory(keyword);
    saveSelectionToHistory(selectedSlug);
  } catch (error) {
    console.error("Error during keyword search:", error.message);
  }
};

export const searchApiByKeywordAndSelection = async (keyword, slug) => {
  try {
    const results = await getDataByKeywordAndSlug(
      keyword.toLowerCase(),
      slug.toLowerCase()
    );

    // Print selections differently based on keywords
    switch (keyword.toLowerCase()) {
      case "monsters":
        printMonsterSelection(results);
        break;
      case "spells":
        printSpellSelection(results);
        break;
      case "classes":
        printClassSelection(results);
        break;
    }
  } catch (error) {
    console.error("Error during selection search: ", error.message);
  }
};

// prints information about monsters
const printMonsterSelection = (results) => {
  console.log("Monster Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log(`Size: `, results?.size || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("*******************");
};

// prints information about spells (monster atm)
const printSpellSelection = (results) => {
  console.log("Spell Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log(`Level: `, results?.level || "N/A");
  console.log(`Range: `, results?.range || "N/A");
  console.log("*******************");
};

// prints information about classes (monster atm)
const printClassSelection = (results) => {
  console.log("Class Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log(`Equipment: `, results?.equipment || "N/A");
  console.log("*******************");
};

// Save keyword to search_history_keyword.json
const saveKeywordToHistory = async (keyword) => {
  // Check if the keyword already exists
  const existingKeywords = await find("search_history_keyword", { keyword });

  if (existingKeywords.length === 0) {
    // inserts new key words
    await insert("search_history_keyword", { keyword });
  }
};

// Save item to search_history_selection.json
const saveSelectionToHistory = async (Slug) => {
  const existingSelections = await find("search_history_selection", { Slug });

  if (existingSelections.length === 0) {
    //insert new items
    await insert("search_history_selection", { Slug });
  }
};

///************ NOT SURE IF WE NEED THE FUNCTIONS BELLOW  */

/**
 * Displays a list of past search keywords from search_history_keyword.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects a keyword, the app re-runs the search with that keyword.
 */
export const showKeywordHistory = async () => {
  // Implement displaying keyword history here
};

/**
 * Displays a list of past selections (items) from search_history_selection.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects an item, the app retrieves and displays its detailed information.
 */
export const showSelectionHistory = async () => {
  // Implement displaying selection history here
};

/**
 * Reads the content from a given history file (either keyword or selection history).
 * If the file doesn't exist, it returns an empty array.
 *
 * @param {string} file - The path to the history file to read from (e.g., 'search_history_keyword.json').
 * @returns {Array} - The content of the history file or an empty array if the file doesn't exist.
 */
const readHistory = (file) => {
  // Implement reading history from file here
};

/**
 * Saves a unique entry to a specified history file.
 * Checks if the entry is already present in the file before adding it.
 *
 * @param {string} file - The path to the history file (e.g., 'search_history_keyword.json').
 * @param {Object} entry - The entry to be saved to the history file (either a keyword or selection).
 */
const saveHistory = (file, entry) => {
  // Implement saving unique history entries here
};

/**
 * Handles the command line arguments and executes the corresponding functionality.
 * Runs the search function for a keyword or displays history based on the argument.
 *
 * @param {string} command - The command to execute, either 'search' or 'history'.
 * @param {Array} args - The arguments passed with the command (e.g., keyword for search or 'keywords'/'selections' for history).
 */
const handleCommand = async (command, args) => {
  // Implement command handling here
};

/**
 * Executes the app based on user input from the command line.
 * Parses the command and arguments and calls the appropriate function (search, showKeywordHistory, or showSelectionHistory).
 */
const runApp = () => {
  // Implement running the app here
};
