import { getDataByKeyword, getDataByKeywordAndSlug } from "./api.js";
import { insert, find } from './db.js'; 
import { select } from '@inquirer/prompts';

/// Searches for a type of selection Monster/spell/class
export const searchK = async (keyword, selectedSlug = null) => {
  try {
    const results = await getDataByKeyword(keyword.toLowerCase());

    // Extract slugs
    const slugs = results.map((item) => ({
      name: item.name,
      value: item.slug,
    }));

    let finalSlug = selectedSlug;
    if (!selectedSlug) {
      // If no selection was passed in the CLI, ask the user for one.
      finalSlug = await select({
        message: "Select a slug:",
        choices: slugs,
      });
    }

    // Now search for the specific item
    await searchKS(keyword, finalSlug);

    // Save Keywords and items 
    saveKeywordToHistory(keyword);
    saveSelection(keyword, finalSlug);
  } catch (error) {
    console.error("Error during search:", error);
  }
};

export const searchKS = async (keyword, slug) => {
  getDataByKeywordAndSlug(keyword, slug)
    .then((results) => {
      console.log(keyword)
      /// print outs in proper format 
      printcheck(results,keyword)
      //console.log("API Results:", results); // prints data founf from call /////////// CODE NO LONGER NEEDED MAY REMOVE AFTER REVIEW
    })

};

// print different things based on keyword
const printcheck = (results, keyword)=>{

  if (keyword =="monsters")
    monsterprint(results)

  if (keyword == "spells")
    spellprint(results)
  if (keyword == "classes")
    classprint(results)


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

const spellprint = (results) =>{


  console.log("Spell Details:");
  console.log("*******************");
  console.log("Name: ", results.name);
  console.log("Description: ", results.desc);
  console.log(`Level: `, results.level);
  console.log("*******************");
};

// prints information about classes (monster atm)


const classprint = (results) =>{

  console.log("Class Details:");
  console.log("*******************");
  console.log("Name: ", results.name);
  console.log("Description: ", results.desc);
  console.log(`Armor: `, results.prof_armor);
  console.log(`Weapons: `, results.prof_weapons);
  console.log(`Skills: `, results.prof_skills);
  console.log("*******************");
};

 // Save keyword to search_history_keyword.json
 const saveKeywordToHistory = async (keyword) => {
     // Check if the keyword already exists
     const existingKeywords = await find('search_history_keyword', { keyword });
 
     if (existingKeywords.length === 0) {
       // inserts new key words 
       await insert('search_history_keyword', { keyword });
     } 
    };

 // Save item to search_history_selection.json 
 const saveSelection = async (keyword, slug) => {
  const existingSelections = await find('search_history_selection', { slug });

  if (existingSelections.length === 0) {
    // Insert new selection with both keyword and slug
    await insert('search_history_selection', { keyword, slug });
  }
};

/**
 * Displays a list of past search keywords from search_history_keyword.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects a keyword, the app re-runs the search with that keyword.
 */
export const showKeywordHistory = async () => {
  try {
    let history = await find('search_history_keyword');

    // Print the type and the data returned by find
    console.log("Data type of history:", typeof history);
    console.log("History data:", history);

    // Ensure history is always an array
    if (!Array.isArray(history)) {
      history = history ? [history] : []; // Convert object to array, or default to empty array
    }

    if (history.length === 0) {
      console.log("No keyword history found.");
      return;
    }

    const selectedKeyword = await select({
      message: "Select a keyword from history to search again:",
      choices: [{ name: "Exit", value: null },...history.map((h) => ({ name: h.keyword, value: h.keyword }))],
    });

    if (selectedKeyword) await searchK(selectedKeyword);
  } catch (error) {
    console.error("Error displaying keyword history:", error);
  }
};

/**
 * Displays a list of past selections (items) from search_history_selection.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects an item, the app retrieves and displays its detailed information.
 */
export const showSelectionHistory = async () => {
  const history = await find('search_history_selection');
  if (history.length === 0) {
    console.log("No selection history found.");
    return;
  }

  const selectedSlug = await select({
    message: "Select an item from history to view details:",
    choices: [{ name: "Exit", value: null }, ...history.map((h) => ({ name: h.slug, value: h.slug }))],
  });
  if (selectedSlug) {
    // Get the corresponding keyword for the selected slug
    const selection = history.find((h) => h.slug === selectedSlug); // Find the item that matches the selected slug
    if (selection) {
      const keyword = selection.keyword;  // Access the keyword from the selection object
      await searchKS(keyword, selectedSlug);  // Pass the keyword and selected slug to searchKS
    } else {
      console.log("No corresponding keyword found for the selection.");
    }
  }
};
