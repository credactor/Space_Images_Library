import axios from "axios";

export const fetchImages = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "/images";
    // console.log(BASE_URL);
    const response = await axios.get(BASE_URL);
    if (response.status === 200) {
      const imagesArray = Object.keys(response.data).map((key) => Object.assign({}, {id: key}, response.data[key]));
      console.log("API:", imagesArray.length);
      return imagesArray;
    }
  } catch (error) {
    console.log(error);
  }
};
