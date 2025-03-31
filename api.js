import axios from "axios";

const BASE_URL = "https://api.open5e.com/";

const endpoints = {
  monsters: "v1/monsters/",
  spells: "v1/spells/",
  classes: "v1/classes/",
  spelllist: "v1/spelllist/",
  documents: "v1/documents/",
  backgrounds: "v1/backgrounds/",
  planes: "v1/planes/",
  sections: "v1/sections/",
  feats: "v1/feats/",
  conditions: "v1/conditions/",
  races: "v1/races/",
  magicitems: "v1/magicitems/",
  weapons: "v1/weapons/",
  armor: "v1/armor/",
};

export const getDataByKeyword = async (keyword, page = 1) => {
  try {
    const url = `${BASE_URL + endpoints[keyword]}?page=${page}`;
    const res = await axios.get(url);

    return {
      results: res.data.results,
      next: res.data.next, // Link to the next page (or null if none)
      previous: res.data.previous, // Link to the previous page (or null if none)
    };
  } catch (error) {
    console.error(`Error fetching data for '${keyword}' (page ${page}):`, error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};


export const getDataByKeywordAndSlug = async (keyword, slug) => {
  try {
    if (keyword === "documents") {
      const res = await axios.get(`${BASE_URL}${endpoints[keyword]}?slug=${slug}`);
      return res.data.results;
    } else {
      const res = await axios.get(`${BASE_URL}${endpoints[keyword]}${slug}/`);
      return res.data;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`No data found for '${slug}' in '${keyword}'.`);
    }
    console.error(`Error fetching details for '${slug}':`, error.message);
    throw new Error("Failed to fetch item details. Please try again.");
  }
};
