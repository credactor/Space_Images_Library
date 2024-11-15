import axios from "axios";

export const likeImage = async (user_id, item_id, likes_list) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/like";
    try {
        const response = await axios.post(BASE_URL, { user_id, item_id, likes_list }, {
            withCredentials: true,
        });
        if (response.status === 200) {
            // console.log("like:", response.data);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};