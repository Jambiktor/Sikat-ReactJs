import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DiaryEntry from "../../../assets/DiaryEntry.png";
import uploadIcon from "../../../assets/upload.png";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import SubjectSelection from "../LayoutUser/SubjectSelection";
import userDefaultProfile from "../../../assets/userDefaultProfile.png";
import alarmingWords from "../AlarmingWords"; // Correct import for alarming words

function DiaryEntryButton({ onEntrySaved }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [anonimity, setAnonimity] = useState("private");
  const [file, setFile] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState("");
  const [alarmingWordWarning, setAlarmingWordWarning] = useState("");
  const [fileError, setFileError] = useState("");

  const handleSubjectsChange = (subjectsText) => {
    setSelectedSubjects(subjectsText);
  };

  const navigate = useNavigate();

  const handleChangeVisibility = (event) => {
    setVisibility(event.target.value);
  };

  const handleChangeAnonimity = (event) => {
    setAnonimity(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        setFileError(
          "File size exceeds the 2MB limit. Please select a smaller file."
        );
        setFile(null); // Clear the invalid file
      } else {
        setFileError(""); // Clear any previous errors
        setFile(selectedFile); // Set the valid file
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleClose = () => {
    setShow(false);
    setFormErrors({});
    setServerError("");
    setTitle("");
    setDescription("");
    setFile(null);
    setAlarmingWordWarning(""); // Reset warning
  };

  const handleShow = () => setShow(true);

  const containsAlarmingWords = (text) => {
    return alarmingWords.some((word) => text.toLowerCase().includes(word));
  };

  const handleSubmit = () => {
    let errors = {};
    if (!title) errors.title = "Title is required.";
    if (!description) errors.description = "Description is required.";
    setFormErrors(errors);

    // Check for alarming words in title and description
    if (containsAlarmingWords(title) || containsAlarmingWords(description)) {
      setAlarmingWordWarning(
        "Warning: Your entry contains potentially harmful words. Proceed with caution."
      );
    } else {
      setAlarmingWordWarning("");
    }

    if (Object.keys(errors).length > 0) return;

    if (!user || !user.userID) {
      setServerError("User not authenticated. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("userID", user.userID);
    formData.append("visibility", visibility);
    formData.append("anonimity", anonimity);

    if (selectedSubjects && selectedSubjects.trim() !== "") {
      formData.append("subjects", selectedSubjects);
    }

    if (file) {
      formData.append("file", file);
    }

    setLoading(true);
    setServerError("");

    axios
      .post("http://localhost:8081/entry", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setTitle("");
        setDescription("");
        setFile(null);
        handleClose();
        if (onEntrySaved) {
          onEntrySaved();
        }
      })
      .catch((error) => {
        console.error("There was an error saving the diary entry!", error);
        setServerError("Failed to save diary entry. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <button
        className="primaryButton w-100 d-flex align-items-center justify-content-center"
        onClick={handleShow}
      >
        <p className="m-0">Diary Entry</p>
        <i className="bx bxs-edit m-0 ms-1"></i>
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="m-0">Create New Diary</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2 border-bottom pb-2">
            <div className="d-flex align-items-center gap-2">
              <div className="profilePicture">
                <img
                  src={
                    user?.profile_image
                      ? `http://localhost:8081${user?.profile_image}`
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
              <p className="m-0">
                {user?.firstName} {user?.lastName || "User"}
              </p>
            </div>
            <div className="row d-flex flex-column flex-md-row justify-content-center align-items-center gap-1 mx-2">
              <div class="col input-group p-0">
                <select
                  class="form-select"
                  id="visibility"
                  value={visibility}
                  onChange={handleChangeVisibility}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div class="col input-group p-0">
                <select
                  class="form-select"
                  id="anonimity"
                  value={anonimity}
                  onChange={handleChangeAnonimity}
                  disabled={visibility === "private"}
                >
                  <option value="private">Anonymous</option>
                  <option value="public">Not Anonymous</option>
                </select>
              </div>
            </div>
          </div>
          {serverError && <p className="text-danger">{serverError}</p>}
          {alarmingWordWarning && (
            <p className="text-warning">{alarmingWordWarning}</p>
          )}
          <div className="d-flex align-items-center">
            <SubjectSelection onSubjectsChange={handleSubjectsChange} />
            {selectedSubjects && (
              <div className="">
                <p className="m-0">{selectedSubjects}</p>
              </div>
            )}
          </div>
          <div className="">
            <InputGroup className="mb-1">
              <Form.Control
                className="rounded"
                placeholder="Journal Title"
                aria-label="Journal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isInvalid={!!formErrors.title}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
            </InputGroup>
            <FloatingLabel
              controlId="floatingTextarea2"
              label={`Describe your day, ${user?.firstName || "User"}!`}
            >
              <Form.Control
                as="textarea"
                placeholder=""
                style={{ height: "100px" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={!!formErrors.description}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className="ps-1 pt-2">
              <label htmlFor="uploadPhoto">
                <div style={{ cursor: "pointer" }}>
                  <img
                    className="miniIcon mb-1 me-1"
                    src={uploadIcon}
                    alt="Upload icon"
                  />
                  <span>Upload Photo (e.g., .jpg, .png)</span>
                </div>
              </label>
              <input
                type="file"
                id="uploadPhoto"
                hidden
                accept="image/*" // Restricts file selection to images only
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-2 d-flex align-items-center gap-2">
                  <p className="text-success m-0">
                    Selected file: <strong>{file.name}</strong>
                  </p>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setFile(null)} // Clears the file
                    aria-label="Remove selected file"
                  >
                    Remove
                  </Button>
                </div>
              )}
              {fileError && <p className="text-danger mt-2">{fileError}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            <p className="m-0">Close</p>
          </Button>
          <button
            className="orangeButton py-2"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            aria-label="Save diary entry"
          >
            <p className="m-0">
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </p>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DiaryEntryButton;
