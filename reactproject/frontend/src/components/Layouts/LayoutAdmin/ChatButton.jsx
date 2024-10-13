import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ChatIcon from "../../../assets/ChatIcon.png";
import SendIcon from "../../../assets/SendIcon.png";
import DefaultProfile from "../../../assets/userDefaultProfile.png";

const ChatButton = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setMessages([]); // Clear messages when closing the modal
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      alert("You need to log in to access the chat.");
      window.location.href = "/";
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8081/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user) return;

    const pusher = new Pusher("4810211a14a19b86f640", {
      cluster: "ap1",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`user-${user.userID}`);

    channel.bind("message-event", function (data) {
      if (selectedUser && data.recipientID === selectedUser.userID) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderID: data.senderID, message: data.message },
        ]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [user, selectedUser]);

  const fetchMessagesForSelectedUser = async (withUserID) => {
    try {
      const response = await fetch(
        `http://localhost:8081/messages?userID=${user.userID}&withUserID=${withUserID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
      setSelectedUser(users.find((usr) => usr.userID === withUserID));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserClick = (userItem) => {
    fetchMessagesForSelectedUser(userItem.userID);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user || !selectedUser) return;

    try {
      const response = await fetch(`http://localhost:8081/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderID: user.userID,
          recipientID: selectedUser.userID,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { senderID: user.userID, message: newMessage },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setMessages([]); // Clear messages when going back
  };

  return (
    <>
      <div className="ChatButton">
        <button className="shadow" onClick={handleShow}>
          <img
            src={ChatIcon}
            alt=""
            style={{ width: "35px", height: "35px", marginRight: "1px" }}
          />
          <span className="tooltiptext" style={{ zIndex: "-2" }}>
            Messages
          </span>
        </button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-1"
          style={{ height: "clamp(400px, 30vh, 500px)", overflow: "hidden" }}
        >
          <div>
            {!selectedUser ? (
              <div
                className="UserList"
                style={{ height: "clamp(400px, 30vh, 500px)" }}
              >
                <h5 className="m-0">Users</h5>
                <div style={{ height: "85%" }}>
                  <div
                    className="mb-4 pe-2 d-flex flex-column gap-2 overflow-y-scroll"
                    style={{ height: "100%" }}
                  >
                    {users.map((userItem, index) => (
                      <div
                        key={index}
                        className="grayHover d-flex align-items-center gap-2 bg-light p-2 rounded"
                        onClick={() => handleUserClick(userItem)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="profilePicture">
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
                        <p className="m-0">
                          {userItem.username} {userItem.lastName} or (Alias)
                        </p>
                        <div
                          className="p-0 m-0 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: "red",
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            color: "#ffff",
                          }}
                        >
                          <p className="m-0 p-0" style={{ fontSize: "13px" }}>
                            0
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="ChatRoom mb-1 p-2"
                style={{ height: "clamp(400px, 30vh, 500px)" }}
              >
                <div onClick={handleBackClick} style={{ cursor: "pointer" }}>
                  <i className="bx bx-arrow-back"></i> {selectedUser.username}
                </div>
                <div>
                  <div
                    className="border rounded"
                    style={{ height: "225px", overflowY: "scroll" }}
                  >
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`w-100 p-2 d-flex justify-content-${
                          msg.senderID === user?.userID ? "end" : "start"
                        }`}
                      >
                        <div
                          className="rounded p-2 text-light"
                          style={{
                            backgroundColor:
                              msg.senderID === user?.userID
                                ? "#ff8533"
                                : "#990099",
                            maxWidth: "200px",
                            width: "fit-content",
                            wordWrap: "break-word",
                          }}
                        >
                          <p className="m-0">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <FloatingLabel
                      controlId="floatingTextarea2"
                      label="Message"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ height: "80px" }}
                      />
                    </FloatingLabel>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <Button onClick={sendMessage}>
                      Send{" "}
                      <img
                        src={SendIcon}
                        alt=""
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatButton;
