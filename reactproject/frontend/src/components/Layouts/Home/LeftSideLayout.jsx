import DefaultProfile from "../../../assets/userDefaultProfile.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LeftSideLoader } from "../../loaders/LeftSideLoader";
import axios from "axios";

const LeftSideAdmin = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/fetchUserEntry/user/${user.userID}`
      );
      setEntries(response.data.entries || []);
    } catch (err) {
      setError("Error fetching entries.");
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]); // Fetches only when `user` is updated

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <LeftSideLoader />;
  }

  if (!user) return <p className="text-danger">Error fetching user data.</p>;

  return (
    <div className="p-2">
      <Link
        className="text-decoration-none text-dark"
        to={`/Profile/${user.userID}`}
      >
        <div className="mainProfilePicture d-flex align-items-center flex-column rounded gap-2 shadow py-4">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#ffff",
              width: "clamp(7rem, 10vw, 15rem)",
              height: "clamp(7rem, 10vw, 15rem)",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={
                user.profile_image
                  ? `http://localhost:8081${user.profile_image}`
                  : DefaultProfile
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h5 className="m-0 mt-1 text-light">{user.firstName}</h5>
        </div>
      </Link>

      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between border-bottom border-secondary-subtle pb-2">
          <div className="d-flex align-items-center text-secondary gap-1">
            <i className="bx bx-edit bx-sm"></i>
            <h5 className="m-0 text-start">
              {user.isAdmin ? "Latest Post" : "My Diary Entries"}
            </h5>
          </div>
          <Link to="/DiaryEntries" className="linkText rounded p-1">
            <p className="m-0">View All</p>
          </Link>
        </div>
        <div
          className="mt-1 pe-1 custom-scrollbar"
          style={{ height: "45vh", overflowY: "scroll" }}
        >
          {error ? (
            <p className="text-danger">{error}</p>
          ) : entries.length === 0 ? (
            <p>No entries available.</p>
          ) : (
            entries.map((entry) => (
              <Link
                key={entry.entryID}
                to={`/DiaryEntry/${entry.entryID}`}
                className="rounded text-decoration-none"
              >
                <div className="journalEntries d-flex flex-column rounded ps-1 mt-1">
                  <p className="m-0 p-1 text-start text-secondary">
                    {entry.title} - {formatDate(entry.created_at)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSideAdmin;
