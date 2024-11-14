import axios from "axios";
import { Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  const logout = async () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "/user/logout"
    try {
      const response = await axios.delete(BASE_URL);
      if (response.status === 200) {
        console.log(response.status);
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/");
    }
  };

  return (
    <>
    <Stack spacing={2} direction={"row"}>
      <Button LinkComponent={Link} to='/'>
        Home
      </Button>
      {/* <Button LinkComponent={Link} to='/admin'>
        Admin
      </Button> */}
      <Button LinkComponent={Link} to='/login'>
        Login
      </Button>
      <Button LinkComponent={Link} to='/register'>
        Register
      </Button>
      <Button onClick={logout}>Logout</Button>
    </Stack>
    <h1>SPACE&nbsp;&nbsp;IMAGES&nbsp;&nbsp;LIBRARY</h1>
        </>
  );
};
export default Header;
