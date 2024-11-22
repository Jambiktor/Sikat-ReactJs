import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LeftSide from "../../pages/PagesUser/HomeLayout/LeftSide";
import Center from "../../pages/PagesUser/HomeLayout/Center";
import RightSide from "../../pages/PagesUser/HomeLayout/RightSide";

import AdminLeftSide from "../../pages/PagesAdmin/HomeLayout/LeftSide";
import AdminCenter from "../../pages/PagesAdmin/HomeLayout/Center";
import AdminRightSide from "../../pages/PagesAdmin/HomeLayout/RightSide";

import MainLayout from "../MainLayout";
import ChatButton from "../LayoutUser/ChatButton";
import AdminChatButton from "../LayoutAdmin/ChatButton";
import CenterLayout from "./CenterLayout";

export default function HomeMainLayout({ isAdminPage }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // loading state for user data
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/"); // use react-router navigation for redirect
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>; // simple loading indicator

  return (
    <MainLayout ActiveTab="Home">
      <div className="overflow-x-hidden">
        <div className="row mt-3 px-3">
          <div>{isAdminPage ? <AdminChatButton /> : <ChatButton />}</div>

          {/* Left Side Component */}
          <div
            className="position-fixed col-lg d-none d-lg-block"
            style={{
              top: "5.5rem",
              height: "calc(100dvh - 5.5rem)",
              left: "0",
              width: "25%",
            }}
          >
            {isAdminPage ? <AdminLeftSide /> : <LeftSide />}
          </div>

          {/* Center Layout - Adjust the margin to prevent overlap */}
          <div
            className="col-lg-6 mx-auto"
            style={{ marginLeft: "20%", marginRight: "20%" }}
          >
            <CenterLayout />
          </div>

          {/* Right Side Component */}
          <div
            className="position-fixed col-md d-none d-lg-block"
            style={{
              top: "5.5rem",
              height: "calc(100dvh - 5.5rem)",
              right: "0",
              width: "25%",
            }}
          >
            {isAdminPage ? <AdminRightSide /> : <RightSide />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
