import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import anonymous from "../../assets/anonymous.png";
import userDefaultProfile from "../../assets/userDefaultProfile.png";
import TransparentLogo from "../../assets/TransparentLogo.png";
import ReportButton from "./ReportButton";
import CommentSection from "./CommentSection";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

const DiaryEntryLayout = ({
  entry,
  user, // Props instead of state
  followedUsers,
  handleFollowToggle,
  handleClick,
  expandButtons,
}) => {
  const [entries, setEntries] = useState([]); // This is needed for entries
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    sexualHarassment: false,
    domesticAbuse: false,
    genderRelated: false,
  });

  useEffect(() => {
    if (user) {
      fetchEntries(user.userID, filters);
    }
  }, [user, filters]);

  const fetchEntries = async (userID, filters) => {
    try {
      console.log("Fetching entries for user:", userID);
      console.log("Applied filters:", filters);

      const response = await axios.get("http://localhost:8081/entries", {
        params: { userID: userID, filters: filters },
      });

      console.log("Entries response:", response.data);

      const gadifyStatusResponse = await axios.get(
        `http://localhost:8081/gadifyStatus/${userID}`
      );

      console.log("Gadify status response:", gadifyStatusResponse.data);

      const updatedEntries = response.data.map((entry) => {
        const isGadified = gadifyStatusResponse.data.some(
          (g) => g.entryID === entry.entryID
        );
        return { ...entry, isGadified };
      });

      setEntries(updatedEntries);
    } catch (error) {
      console.error("There was an error fetching the diary entries!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (selectedFiltersArray) => {
    const activeFilters = [];

    if (selectedFiltersArray.includes("Sexual Harassment")) {
      activeFilters.push("Sexual Harassment");
    }

    if (selectedFiltersArray.includes("Domestic Abuse")) {
      activeFilters.push("Domestic Abuse");
    }

    if (selectedFiltersArray.includes("Gender Related")) {
      activeFilters.push("Gender Related");
    }

    setFilters(activeFilters);
  };

  const handleGadify = (entryID) => {
    if (!user) return;

    const entry = entries.find((entry) => entry.entryID === entryID);
    if (!entry) return;

    axios
      .post(`http://localhost:8081/entry/${entryID}/gadify`, {
        userID: user.userID,
      })
      .then((res) => {
        const isGadified =
          res.data.message === "Gadify action recorded successfully";

        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.entryID === entryID
              ? {
                  ...entry,
                  gadifyCount: isGadified
                    ? entry.gadifyCount + 1
                    : entry.gadifyCount - 1,
                }
              : entry
          )
        );

        if (isGadified && user.userID !== entry.userID) {
          axios
            .post(`http://localhost:8081/notifications/${entry.userID}`, {
              actorID: user.userID,
              entryID: entryID,
              type: "gadify",
              message: `${user.username} gadified your diary entry.`,
            })
            .then((res) => {
              console.log("Notification response:", res.data);
            })
            .catch((err) => {
              console.error("Error sending gadify notification:", err);
            });
        }
      })
      .catch((err) => console.error("Error updating gadify count:", err));
  };

  const formatDate = (dateString) => {
    const entryDate = new Date(dateString);
    const now = new Date();
    const timeDiff = now - entryDate;

    if (timeDiff < 24 * 60 * 60 * 1000) {
      return entryDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Replace with proper loader
  }

  return (
    <div
      key={entry.entryID}
      className="position-relative rounded shadow-sm p-3 mb-2"
      style={{ backgroundColor: "white" }}
    >
      <div className="d-flex align-items-start border-bottom pb-2">
        {entry.anonimity === "private" ? (
          <div className="d-flex align-items-center gap-2">
            <div className="profilePicture">
              <img
                src={entry.isAdmin === 1 ? TransparentLogo : anonymous}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="d-flex flex-column align-items-start">
              {entry.isAdmin === 1 ? "Gender and Development" : entry.alias}
              <p className="m-0" style={{ fontSize: ".7rem" }}>
                {formatDate(entry.created_at)}
              </p>
            </div>
          </div>
        ) : (
          <Link to={`/Profile/${entry.userID}`} className="linkText rounded">
            <div className="d-flex align-items-center gap-2">
              <div className="profilePicture">
                <img
                  src={
                    entry.profile_image
                      ? `http://localhost:8081${entry.profile_image}`
                      : userDefaultProfile
                  }
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="d-flex flex-column align-items-start">
                {entry.isAdmin === 1 ? entry.username : "Alias"}
                <p className="m-0" style={{ fontSize: ".7rem" }}>
                  {formatDate(entry.created_at)}
                </p>
              </div>
            </div>
          </Link>
        )}
        {user &&
          user.userID !== entry.userID &&
          entry.anonimity !== "private" && (
            <div className="d-flex align-items-center gap-1">
              <p className="m-0 fs-3 text-secondary">·</p>
              <button
                className="secondaryButton p-0 m-0"
                onClick={() => handleFollowToggle(entry.userID)}
                style={{ height: "1.5rem" }}
              >
                {followedUsers.includes(entry.userID) ? "Following" : "Follow"}
              </button>
            </div>
          )}
        <div>
          <Dropdown>
            <Dropdown.Toggle
              className="btn-light d-flex align-items-center pt-0 pb-2"
              id="dropdown-basic"
              bsPrefix="custom-toggle"
            >
              <h5 className="m-0">...</h5>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-2">
              <Dropdown.Item className="p-0 btn btn-light">
                <ReportButton></ReportButton>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="text-start border-bottom p-2">
        <h5>
          {entry.title}{" "}
          <span className="text-secondary fs-6">{entry.subjects}</span>
        </h5>
        <p>{entry.description}</p>
        {entry.diary_image && (
          <img
            className="DiaryImage mt-1 rounded"
            src={`http://localhost:8081${entry.diary_image}`}
            alt="Diary"
          />
        )}
      </div>
      <div className="row pt-2">
        <div className="col">
          <button
            className={`InteractButton d-flex align-items-center justify-content-center gap-1 ${
              entry.isGadified ? "active" : ""
            } ${expandButtons[entry.entryID] ? "expand" : ""}`}
            onClick={() => handleClick(entry.entryID)}
          >
            {entry.isGadified ? (
              <i className="bx bxs-heart"></i>
            ) : (
              <i className="bx bx-heart"></i>
            )}
            <span>{entry.gadifyCount}</span>
            <p className="m-0">Gadify</p>
          </button>
        </div>
        <div className="col">
          <CommentSection
            userID={user.userID}
            entryID={entry.entryID}
            entry={entry.userID}
          />
        </div>
        <div className="col">
          <button className="InteractButton">Flag</button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntryLayout;
