import axios from "axios";

export const verifyUser = async () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/auth";
    try {
        const response = await axios.get(BASE_URL, {
            withCredentials: true,
        });
        if (response.status === 200) {
            // console.log(response.data);            
            // let user_email = response.data.user.email;
            // console.log("user email:", user_email);            
            // const id = await getId(user_email);
            const id = response.data.user.userid;
            console.log("id:", id);
            return id;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
};

// const getId = async (email) => {
//     const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/getid";
//     try {
//         const response = await axios.post(BASE_URL, { email, }, {
//             withCredentials: true,
//         });
//         // console.log("getId:",BASE_URL, email);
//         if (response.status === 200) {
//             // console.log("AAA", response.data);
//             return response.data.user.userid;
//         }
//     } catch (error) {
//         console.log(error);
//         return 0;
//     }
// };