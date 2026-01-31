import AuthNavbar from "./AuthNavbar";  
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <AuthNavbar />
      <Outlet />
    </>
  );
}
