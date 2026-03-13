import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";

export default function ProfileLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
