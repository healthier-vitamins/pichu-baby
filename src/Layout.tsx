import NavBar from "components/NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </>
  );
}

export default Layout;
