import axios from "axios";

const BASE_URL = "https://api.open5e.com/";

const endpoints = {
  monsters: "v1/monsters/",
  spells: "v1/spells/",
  classes: "v1/classes/",
};

export const getDataByKeyword = async (keyword) => {
  try {
    const res = await axios.get(BASE_URL + endpoints[keyword]);
    return res.data?.results;
  } catch (error) {
    throw error;
  }
};

export const getDataByKeywordAndSlug = async (keyword, slug) => {
  try {
    const res = await axios.get(`${BASE_URL}${endpoints[keyword]}${slug}/`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
