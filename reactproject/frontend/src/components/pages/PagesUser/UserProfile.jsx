import React from "react";
import DefaultProfile from "../../../assets/userDefaultProfile.png";
import UserNavBar from "../../Layouts/NavBarUser";
import Background from "../../Layouts/Background";
import { Link, useNavigate } from "react-router-dom";
import RecentJournalEntries from "./UserProfileLayout/JournalEntries";
import ActivityLogs from "./UserProfileLayout/ActivityLogs";
import FiledCases from "./UserProfileLayout/FiledCases";
import UserDiary from "./UserProfileLayout/UserDiary";

const UserProfile = () => {
  const Alias = "Alias";
  return (
    <div>
      <UserNavBar />
      <div
        className="container position-relative mt-4 p-3 rounded shadow"
        style={{ background: "linear-gradient(to right, #ff8533, #990099)" }}
      >
        <div className="row">
          <div className="col-lg-4 col d-flex justify-content-center align-items-center ">
            <div
              style={{
                backgroundColor: "#ffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "clamp(250px, 50%, 450px)",
                height: "clamp(250px, 50%, 450px)",
                // border: "2px solid lightgray",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={DefaultProfile}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
          <div className="col-md text-light text-center text-md-start d-flex flex-column justify-content-center pt-5">
            <div className="">
              <h3>Juan Dela Cruz ({Alias})</h3>
              <p>(00) Followers - (00) following</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptas dolorum tenetur necessitatibus quisquam nam,
                voluptatibus illum maxime assumenda molestias distinctio!
              </p>
            </div>
          </div>
          <Link
            className="text-decoration-none text-dark"
            to="/UpdateUser/${user.userID}"
          >
            <button
              className="orangeButton position-absolute text-end"
              style={{ right: "10px", top: "10px" }}
            >
              Edit Personal Details
            </button>
          </Link>
        </div>
      </div>

      <div className="container mt-3">
        <div className="row ">
          <div
            className="col-lg-3 mb-2 p-0 px-md-2"
            style={{ minHeight: "37vh" }}
          >
            <div
              className="d-flex flex-column gap-2"
              //   style={{ minHeight: "50vh" }}
            >
              <div>
                <RecentJournalEntries />
              </div>
              <div>
                <ActivityLogs />
              </div>
              <div>
                <FiledCases />
              </div>
            </div>
          </div>
          <div className="col p-0 px-md-2">
            <div className="" style={{ minHeight: "60vh" }}>
              <UserDiary />
            </div>
          </div>
        </div>
      </div>

      <Background />
    </div>
  );
};

export default UserProfile;
