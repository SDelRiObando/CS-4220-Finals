import { getDataByKeyword, searchByKeyword, getDataByKeywordAndSlug } from "./services/api.js";
import { insert, find } from "./db.js";
import { select } from "@inquirer/prompts";

//Antonio
export const searchApiByKeyword = async (keyword) => {
  try {
    saveKeywordToHistory(keyword);
    let page = 1;
    let finalSlug = null;

    while (true) {
      const { results, next, previous } = await getDataByKeyword(keyword, page);

      if (results.length === 0) {
        console.log(`No results found for "${keyword}".`);
        return;
      }

      const choices = [
        { name: "Exit", value: null },
        ...(previous ? [{ name: "<=Previous", value: "prev" }] : []),
        ...(next ? [{ name: "Next=>", value: "next" }] : []),
        ...results.map((item) => ({ name: item.name, value: item.slug })),
      ];

      const selected = await select({
        message: `Select a ${keyword} (Page ${page}):`,
        choices,
      });

      if (selected === null) return; // Exit
      if (selected === "next") page++; // Go to next page
      else if (selected === "prev") page--; // Go to previous page
      else {
        finalSlug = selected; // User made a selection
        break;
      }
    }

    if (finalSlug) {
      await searchApiByKeywordAndSelection(keyword, finalSlug);
      saveSelectionToHistory(keyword, finalSlug);
    }
  } catch (error) {
    console.error("Error during search:", error.message);
  }
};

export const searchWithinCategory = async (keyword, searchTerm) => {
  try {
    saveKeywordToHistory(keyword, searchTerm);
    let page = 1;
    let finalSlug = null;

    while (true) {
      const { results, next, previous } = await searchByKeyword(keyword, searchTerm, page);

      if (results.length === 0) {
        console.log(`No results found for "${searchTerm}" in ${keyword}.`);
        return;
      }

      const choices = [
        { name: "Exit", value: null },
        ...(previous ? [{ name: "<= Previous", value: "prev" }] : []),
        ...(next ? [{ name: "Next =>", value: "next" }] : []),
        ...results.map((item) => ({
          name: item.name,
          value: item.slug,
        })),
      ];

      const selected = await select({
        message: `Results for "${searchTerm}" in '${keyword}' (Page ${page}):`,
        choices,
      });

      if (selected === null) return;
      if (selected === "next") page++;
      else if (selected === "prev") page--;
      else {
        finalSlug = selected;
        break;
      }
    }

    if (finalSlug) {
      await searchApiByKeywordAndSelection(keyword, finalSlug);
      saveSelectionToHistory(keyword, finalSlug);
    }
  } catch (error) {
    console.error("Search failed:", error.message);
  }
};

//Antonio
export const searchApiByKeywordAndSelection = async (keyword, slug) => {
  try {
    const results = await getDataByKeywordAndSlug(keyword, slug);
    switch (keyword) {
      case "monsters":
        printMonsterSelection(results);
        break;
      case "spells":
        printSpellSelection(results);
        break;
      case "classes":
        printClassesSelection(results);
        break;
      case "spelllist":
        printSpellListSelection(results);
        break;
      case "documents":
        printDocumentsSelection(results);
        break;
      case "backgrounds":
        printBackgroundsSelection(results);
        break;
      case "planes":
        printPlanesSelection(results);
        break;
      case "sections":
        printSectionsSelection(results);
        break;
      case "feats":
        printFeatsSelection(results);
        break;
      case "conditions":
        printConditionsSelection(results);
        break;
      case "races":
        printRacesSelection(results);
        break;
      case "magicitems":
        printMagicItemsSelection(results);
        break;
      case "weapons":
        printWeaponsSelection(results);
        break;
      case "armor":
        printArmorSelection(results);
        break;
    }
  } catch (error) {
    console.error("Error during keyword and selection search: ", error.message);
  }
};

// prints information about monsters
const printMonsterSelection = (results) => {
  console.log("Monster Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Armor Class: ", results?.armor_class || "N/A");
  console.log("Challenge Rating: ", results?.challenge_rating || "N/A");
  console.log("Size: ", results?.size || "N/A");
  console.log("*******************");
};

// prints information about spells
const printSpellSelection = (results) => {
  console.log("Spell Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log(`Level: `, results?.level || "N/A");
  console.log("*******************");
};

// prints information about classes
const printClassesSelection = (results) => {
  console.log("Classes Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("Armor: ", results?.prof_armor || "N/A");
  console.log("Weapons: ", results?.prof_weapons || "N/A");
  console.log("Skills: ", results?.prof_skills || "N/A");
  console.log("*******************");
};

//Mikey
// prints information about Spell Lists Per Class
const printSpellListSelection = async (results) => {
  if (!results?.spells || results.spells.length === 0) {
    console.log("No spells found.");
    return;
  }
  console.log("Class Spells Details:");
  console.log("*******************");
  console.log("Class: ", results?.name || "N/A");
  console.log("Class Spells: ");
  const formattedSpells = results.spells.map((spell) => ({
    name: spell.replace(/-/g, " "),
    value: spell,
  }));

  const choices = [
    { name: "Exit", value: null },
    ...formattedSpells,
  ];

  const selectedSpell = await select({
    message: "Select a spell to view details:",
    choices,
  });

  if (selectedSpell) {
    await searchApiByKeywordAndSelection("spells", selectedSpell);
  }
};

//print information about documents
const printDocumentsSelection = (results) => {
  console.log("Document Details:");
  console.log("*******************");
  console.log("Title: ", results[0]?.title || "N/A");
  console.log("Description: ", results[0]?.desc || "N/A");
  console.log("Author: ", results[0]?.author || "N/A");
  console.log("*******************");
};

// prints information about backgrounds
const printBackgroundsSelection = (results) => {
  console.log("Backgrounds Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("Skill Proficiencies: ", results?.skill_proficiencies || "N/A");
  console.log("Feature: ", results?.feature || "N/A");
  console.log("Feature Description: ", results?.feature_desc || "N/A");
  console.log("*******************");
};

// prints information about planes
const printPlanesSelection = (results) => {
  console.log("Planes Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("*******************");
};

// prints information about planes
const printSectionsSelection = (results) => {
  console.log("Sections Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("Parent: ", results?.parent || "N/A");
  console.log("*******************");
};

// prints information about feats
const printFeatsSelection = (results) => {
  console.log("Feats Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("Prerequiste: ", results?.prerequisite || "N/A");
  console.log("Effects: ", results?.effects_desc || "N/A");
  console.log("*******************");
};

// prints information about Conditions
const printConditionsSelection = (results) => {
  console.log("Conditions Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("*******************");
};

// prints information about races
const printRacesSelection = (results) => {
  console.log("Races Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("Alignment: ", results?.alignment || "N/A");
  console.log("Traits: ", results?.traits || "N/A");
  console.log("*******************");
};

// prints information about Magic Items
const printMagicItemsSelection = (results) => {
  console.log("Magic Items Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Type: ", results?.type || "N/A");
  console.log("Rarity: ", results?.rarity || "N/A");
  console.log("Description: ", results?.desc || "N/A");
  console.log("*******************");
};

// prints information about Weapons
const printWeaponsSelection = (results) => {
  console.log("Weapons Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Category: ", results?.category || "N/A");
  console.log("Cost: ", results?.cost || "N/A");
  console.log("Damage Type: ", results?.damage_type || "N/A");
  console.log("*******************");
};

// prints information about Armor
const printArmorSelection = (results) => {
  console.log("Armor Details:");
  console.log("*******************");
  console.log("Name: ", results?.name || "N/A");
  console.log("Category: ", results?.category || "N/A");
  console.log("Base Armor Class: ", results?.base_ac || "N/A");
  console.log("Cost: ", results?.cost || "N/A");
  console.log("*******************");
};

//Mikey
// Save keyword and searchTerm to search_history_keyword.json
const saveKeywordToHistory = async (keyword, searchTerm = "") => {
  try {
    const history = await find("search_history_keyword");

    // Find existing keyword entry
    const entry = history.find((item) => item.keyword === keyword);

    if (!entry) {
      // No entry for this keyword yet
      await insert("search_history_keyword", {
        keyword,
        searchTerms: searchTerm ? [searchTerm] : []
      });
    } else if (searchTerm && (!entry.searchTerms || !entry.searchTerms.includes(searchTerm))) {
      // If the keyword exists, but searchTerm is new, just insert a new object
      await insert("search_history_keyword", {
        keyword,
        searchTerms: [searchTerm]
      });
    }
  } catch (error) {
    console.error("Error saving keyword to history:", error);
  }
};


//Mikey
// Save item to search_history_selection.json
const saveSelectionToHistory = async (keyword, slug) => {
  const existingSelections = await find("search_history_selection", { slug });

  if (existingSelections.length === 0) {
    // Insert new selection with both keyword and slug
    await insert("search_history_selection", { keyword, slug });
  }
};

//Santiago
/**
 * Displays a list of past search keywords from search_history_keyword.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects a keyword, the app re-runs the search with that keyword.
 */
export const showKeywordHistory = async () => {
  try {
    let history = await find("search_history_keyword");

    if (history.length === 0) {
      console.log("No keyword history found.");
      return;
    }

    // Flatten each keyword + searchTerm into individual selectable options
    const flattenedChoices = history.flatMap((entry) => {
      if (!entry.searchTerms || entry.searchTerms.length === 0) {
        return [{
          name: `search ${entry.keyword}`,
          value: { keyword: entry.keyword, searchTerm: "" }
        }];
      }

      return entry.searchTerms.map((term) => ({
        name: `search ${entry.keyword} "${term}"`,
        value: { keyword: entry.keyword, searchTerm: term }
      }));
    });

    const selected = await select({
      message: "Select a previous search to run again:",
      choices: [
        { name: "Exit", value: null },
        ...flattenedChoices
      ],
    });

    if (selected) {
      await searchApiByKeyword(selected.keyword, selected.searchTerm);
    }

  } catch (error) {
    console.error("Error displaying keyword history:", error);
  }
};



//Santiago
/**
 * Displays a list of past selections (items) from search_history_selection.json.
 * The first option must be "Exit" to terminate the app.
 * If the user selects an item, the app retrieves and displays its detailed information.
 */
export const showSelectionHistory = async () => {
  const history = await find("search_history_selection");
  if (history.length === 0) {
    console.log("No selection history found.");
    return;
  }

  const selectedSlug = await select({
    message: "Select an item from history to view details:",
    choices: [
      { name: "Exit", value: null },
      ...history.map((h) => ({ name: h.slug, value: h.slug })),
    ],
  });
  if (selectedSlug) {
    // Get the corresponding keyword for the selected slug
    const selection = history.find((h) => h.slug === selectedSlug); // Find the item that matches the selected slug
    if (selection) {
      const keyword = selection.keyword; // Access the keyword from the selection object
      await searchApiByKeywordAndSelection(keyword, selectedSlug); // Pass the keyword and selected slug to searchKS
    } else {
      console.log("No corresponding keyword found for the selection.");
    }
  }
};
