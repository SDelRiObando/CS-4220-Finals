import axios from "axios";

const BASE_URL = "https://api.open5e.com/";

const endpoints = {
  monsters: "v1/monsters/",
  spells: "v1/spells/",
  classes: "v1/classes/",
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
    const res = await axios.get(`${BASE_URL}${endpoints[keyword]}${slug}/`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`No data found for '${slug}' in '${keyword}'.`);
    }
    console.error(`Error fetching details for '${slug}':`, error.message);
    throw new Error("Failed to fetch item details. Please try again.");
  }
};
