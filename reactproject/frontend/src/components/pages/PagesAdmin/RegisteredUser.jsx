import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const RegisteredUsers = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    let filtered = [...users];

    if (selectedCourse !== "All") {
      filtered = filtered.filter((user) => user.course === selectedCourse);
    }

    if (selectedYear !== "All") {
      filtered = filtered.filter((user) => user.year === selectedYear);
    }

    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(lowerCaseQuery) ||
          user.lastName.toLowerCase().includes(lowerCaseQuery) ||
          user.course.toLowerCase().includes(lowerCaseQuery) ||
          user.sex.toLowerCase() === lowerCaseQuery ||
          user.year.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, selectedCourse, selectedYear, searchQuery]);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const downloadData = (format) => {
    if (format === "html") {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registered Users</title>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f4f4f4;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1>Registered Users</h1>
          <table>
            <thead>
              <tr>
                <th>Student No.</th>
                <th>Full Name</th>
                <th>Sex</th>
                <th>Course</th>
                <th>Year</th>
                <th>CvSU Email</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers
                .map(
                  (user) => `
                <tr>
                  <td>${user.studentNumber}</td>
                  <td>${user.firstName} ${user.lastName}</td>
                  <td>${user.sex}</td>
                  <td>${user.course}</td>
                  <td>${user.year}</td>
                  <td>${user.cvsuEmail}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "registered_users.html";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "excel") {
      const header = [
        "Student No.",
        "Full Name",
        "Sex",
        "Course",
        "Year",
        "CvSU Email",
      ];
      const rows = filteredUsers.map((user) => [
        user.studentNumber,
        `${user.firstName} ${user.lastName}`,
        user.sex,
        user.course,
        user.year,
        user.cvsuEmail,
      ]);

      const csvContent = [header, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "registered_users.csv";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ height: "70vh" }}
    >
      <div>
        <div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <i className="bx bx-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search name, course, year"
              aria-label="Search"
              aria-describedby="basic-addon1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>
        {/* Users Table */}
        <div
          className="custom-scrollbar overflow-y-scroll"
          style={{ height: "40vh" }}
        >
          <table className="table rounded overflow-hidden">
            <thead>
              <tr>
                <th scope="col">Student No.</th>
                <th scope="col">Full Name</th>
                <th scope="col">Sex</th>
                <th scope="col">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="form-select border-0 p-0 ps-3 fw-bold"
                    style={{
                      maxWidth: "250px",
                    }}
                  >
                    <option value="All">Courses</option>
                    <option
                      className="text-break"
                      value="BS Information Technology"
                    >
                      BS Information Technology
                    </option>
                    <option value="BS Industrial Technology">
                      BS Industrial Technology
                    </option>
                    <option value="BS Computer Science">
                      BS Computer Science
                    </option>
                    <option value="BS Computer Engineering">
                      BS Computer Engineering
                    </option>
                  </select>
                </th>
                <th scope="col">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="form-select border-0 p-0 px-3 fw-bold"
                    style={{
                      maxWidth: "300px",
                    }}
                  >
                    <option value="All">Year</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                </th>
                <th scope="col">CvSU Email</th>
                <th scope="col">Profile</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.userID}>
                    <th scope="row">{user.studentNumber}</th>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.sex}</td>
                    <td>{user.course}</td>
                    <td>{user.year}</td>
                    <td>{user.cvsuEmail}</td>
                    <td>
                      <Link to={`/Profile/${user.userID}`}>
                        <button className="primaryButton">Visit</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No registered users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between">
          {/* Statistics */}
          <div className="row mt-2 w-50">
            <div className="col-lg-2 d-flex flex-column align-items-start">
              <h5 className="m-0">Total: {filteredUsers.length}</h5>
              <p className="m-0 text-secondary">
                Female:{" "}
                {filteredUsers.filter((user) => user.sex === "Female").length}
              </p>
              <p className="m-0 text-secondary">
                Male:{" "}
                {filteredUsers.filter((user) => user.sex === "Male").length}
              </p>
            </div>
          </div>
          {/* Pagination */}
          <Pagination className="d-flex justify-content-center mt-4">
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev
              onClick={handlePrevClick}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                <span>{index + 1}</span>
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={handleNextClick}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
          </Pagination>
        </div>
      </div>

      {/* Download Button */}
      <div className="d-flex  mt-4">
        <button
          className="primaryButton me-2"
          onClick={() => downloadData("html")}
        >
          Download as HTML
        </button>
        <button className="primaryButton" onClick={() => downloadData("excel")}>
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default RegisteredUsers;
