import React, { useEffect, useState } from "react";
import NavBar from "./NavBar"; // Import the regular user navigation bar
import Background from "./Background"; // Import the background component
import NavBarAdmin from "./LayoutAdmin/NavBarAdmin"; // Import the admin-specific navigation bar
import "boxicons/css/boxicons.min.css";

const MainLayout = ({ children }) => {
  // State to store user data fetched from localStorage
  const [user, setUser] = useState(null);

  // useEffect hook to run logic when the component first mounts
  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");

    // If user data is found
    if (userData) {
      const parsedUser = JSON.parse(userData); // Parse the user data
      setUser(parsedUser); // Set the user data in the state
    } else {
      // If no user data is found, redirect to the homepage
      window.location.href = "/";
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <NavBar />
      <div>{children}</div>

      {/* Include the background component at the bottom of the layout */}
      <Background />
    </div>
  );
};

export default MainLayout;
