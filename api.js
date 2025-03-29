import axios from "axios";

const BASE_URL = "https://api.open5e.com/";

const endpoints = {
  monsters: "v1/monsters/",
  spells: "v1/spells/",
  classes: "v1/classes/",
};

const getDataByKeyword = async (keyword) => {
  if (!endpoints[keyword]) {
    throw new Error(`Invalid keyword: '${keyword}'. Use 'monsters', 'spells', or 'classes'.`);
  }
  try {
    const res = await axios.get(BASE_URL + endpoints[keyword]);
    return res.data;
  } catch (error) {
    console.error(`Error fetching data for '${keyword}':`, error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};

const getDataByKeywordAndSlug = async (keyword, slug) => {
  if (!endpoints[keyword]) {
    throw new Error(`Invalid keyword: '${keyword}'. Use 'monsters', 'spells', or 'classes'.`);
  }
  try {
    const res = await axios.get(
      `${BASE_URL}${endpoints[keyword]}${slug}/`
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`No data found for '${slug}' in '${keyword}'.`);
    }
    console.error(`Error fetching details for '${slug}':`, error.message);
    throw new Error("Failed to fetch item details. Please try again.");  
  }
};

export {getDataByKeyword, getDataByKeywordAndSlug}


