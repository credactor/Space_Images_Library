import axios from "axios";

export const fetchCategories = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "/categories";
    const response = await axios.get(BASE_URL);
    // console.log("cat_base_url:", BASE_URL);
    if (response.status === 200) {
      console.log("getCats:");
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
