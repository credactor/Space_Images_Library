import { useState, useEffect } from "react";
import axios from "axios";


const Dashboard = (props) => {
  const [users, setUsers] = useState();
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    all()
  },[])

  const all = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/all"
      const response = await axios.get(BASE_URL, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data);
        setMsg("");
      }
    } catch (error) {
      setMsg(error.response.data.message);
    }
  };

  return (
    <>
      <h2>Dashboard / Home</h2>
      {users &&
        users.map((item) => {
          return <div key={item.id}>{item.email}</div>;
        })}
      <h3>{msg}</h3>
    </>
  );
};
export default Dashboard;
