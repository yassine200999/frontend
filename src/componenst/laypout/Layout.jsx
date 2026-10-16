import { Outlet } from "react-router-dom";
import Nafbar from "../nafbar/Nafbar";
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