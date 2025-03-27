import axios from "axios";

const BASE_URL = "https://api.open5e.com/";

const endpoints = {
  monsters: "v1/monsters/",
  spells: "v2/spells/",
  classes: "v1/classes/",
};

const getDataByKeyword = async (keyword) => {
  try {
    const res = await axios.get(BASE_URL + endpoints[keyword]);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getDataByKeywordAndSlug = async (keyword, slug) => {
  try {
    const res = await axios.get(
      `${BASE_URL}${endpoints[keyword]}${slug}/`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export {getDataByKeyword, getDataByKeywordAndSlug}


