import "../style.css";
import Logo from "../../../assets/logo.jpg";
import TextLogo from "../../../assets/TextLogo.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import AccountDropdown from "./AccountDropdown";

const NavBar = ({ ActiveTab }) => {
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
      style={{ position: "sticky", top: "0", height: "4rem" }}
    >
      <div className="container-fluid py-2 px-3 ">
        <div className="d-flex align-items-center gap-2">
          <div className="logo">
            <Link to={user && user.isAdmin ? "/Admin/Home" : "/Home"}>
              <img className="logoImage" src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <Link to={user && user.isAdmin ? "/Admin/Home" : "/Home"}>
              <img src={TextLogo} alt="" style={{ height: "2.5rem" }} />
            </Link>
          </div>
        </div>
        <div className="d-flex text-light gap-1">
          <Link
            className={`navIcons text-light ${
              ActiveTab === "Home" ? "active" : ""
            }`}
            to={user && user.isAdmin ? "/Admin/Home" : "/Home"}
          >
            <i class="bx bx-home-alt"></i>
            <p className="navToolTip">Home</p>
          </Link>
          <Link
            className={`navIcons text-light ${
              ActiveTab === "Entries" ? "active" : ""
            }`}
            to="/DiaryEntries"
          >
            <i class="bx bx-note"></i>
            <p className="navToolTip">Diary Entries</p>
          </Link>
          {user && user.isAdmin ? (
            ""
          ) : (
            <Link
              className={`navIcons text-light ${
                ActiveTab === "Followers" ? "active" : ""
              }`}
              to="/Followers"
            >
              <i class="bx bx-user-plus"></i>
              <p className="navToolTip">Followers</p>
            </Link>
          )}

          {user && user.isAdmin ? (
            <Link
              className={`navIcons text-light ${
                ActiveTab === "Complaints" ? "active" : ""
              }`}
              to="/Admin/GenderBasedIncidents"
            >
              <i class="bx bxs-report"></i>
              <p className="navToolTip">Complaints</p>
            </Link>
          ) : (
            ""
          )}

          <Link
            className={`navIcons text-light ${
              ActiveTab === "Settings" ? "active" : ""
            }`}
            to={`/Settings/${user.userID}`}
          >
            <i class="bx bx-cog"></i>
            <p className="navToolTip">Settings</p>
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
