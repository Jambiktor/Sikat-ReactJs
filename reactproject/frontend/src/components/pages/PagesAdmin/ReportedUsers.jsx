import React, { useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const ReportedUsers = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    // Apply filters whenever users, selectedCourse, or selectedYear changes
    let filtered = [...users];

    if (selectedCourse !== "All") {
      filtered = filtered.filter((user) => user.course === selectedCourse);
    }

    if (selectedYear !== "All") {
      filtered = filtered.filter((user) => user.year === selectedYear);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [users, selectedCourse, selectedYear]);

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

  const downloadData = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "registered_users.json";
    link.click();
    URL.revokeObjectURL(url);
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
              <i class="bx bx-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search name, course, year"
              aria-label="Search"
              aria-describedby="basic-addon1"
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
                <th scope="col">Name</th>
                <th scope="col">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="form-select border-0 p-0 fw-bold text-center"
                    style={{
                      maxWidth: "250px",
                    }}
                  >
                    <option value="All">Violation</option>
                    <option
                      className="text-break"
                      value="BS Information Technology"
                    >
                      Gender-Based-Crimes
                    </option>
                    <option value="BS Industrial Technology">
                      Gender-Based-Crimes
                    </option>
                    <option value="BS Computer Science">
                      Gender-Based-Crimes
                    </option>
                    <option value="BS Computer Engineering">
                      Gender-Based-Crimes
                    </option>
                  </select>
                </th>
                <th scope="col">Report Count</th>
                <th scope="col">Reported Comment</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.userID}>
                    <th scope="row">{user.studentNumber}</th>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>Bullying, Harrassment etc.</td>
                    <td>0</td>
                    <td>Sample Alarming Comment</td>
                    <td className="text-success">Pending</td>
                    <td>
                      <button className="secondaryButton">
                        Mark as Reviewed
                      </button>
                      <button className="primaryButton">Check</button>
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
                <span className="paginationItem">{index + 1}</span>
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
      <button className="primaryButton w-100 py-2 mt-4" onClick={downloadData}>
        Download Data
      </button>
    </div>
  );
};

export default ReportedUsers;
