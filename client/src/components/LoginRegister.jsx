import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box } from "@mui/material";

const LoginRegister = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const loginregister = async () => {
    if (mode === "Login") {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/login";
        const response = await axios.post(
          BASE_URL,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setMessage(response.data.message);
          console.log(response.data);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setMessage(error.response.data.message)
      }
    } else if (mode === "Register") {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/register";
        const response = await axios.post(
          BASE_URL,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setMessage(response.data.message);
          console.log(response.data);
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        setMessage(error.response.data.message)
      }
  }
  };

  return (
    <>
      <h2>{mode}</h2>
      <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete='off'>
        <TextField
          sx={{ m: 1 }}
          id='email'
          type='email'
          label='Enter your email...'
          variant='outlined'
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ m: 1 }}
          id='password'
          type='password'
          label='Enter your password...'
          variant='outlined'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Button variant='contained' onClick={loginregister}>
        {mode}
      </Button>
      <div>
        {message}
      </div>
    </>
  );
};
export default LoginRegister;
