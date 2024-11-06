import "../style.css";
import Logo from "../../../assets/logo.jpg";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import AccountDropdown from "./AccountDropdown";

const NavBar = () => {
  const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async (userID) => {
    try {
      const response = await fetch(
        `http://localhost:8081/fetchUser/user/${userID}`
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserData(parsedUser.userID);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <nav
      className="navbar navbar-expand-lg p-0"
      style={{ position: "sticky", top: "0" }}
    >
      <div className="container-fluid py-2 px-3 shadow-sm">
        <div className="logo">
          <Link to={user && user.isAdmin ? "/Admin/Home" : "/Home"}>
            <img className="logoImage" src={Logo} alt="Logo" />
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div>
            <NotificationButton userID={user.userID} />
          </div>
          <div>
            <AccountDropdown userID={user.userID} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
