import { Outlet } from "react-router-dom";
import Nafbar from "../navbar/Navbar";
function Layout() {
  return (
    <>
      <Nafbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
export default Layout;