const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "INVALID_FILE_TYPE";
      return cb(error);
    }
    cb(null, true);
  },
});

app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sikat-ediary",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.put("/update/:userID", (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const sql = `UPDATE user_table SET firstName = ?, lastName = ?, cvsuEmail = ?, username = ?, password = ? WHERE userID = ?`;
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.cvsuEmail,
    req.body.username,
    hashedPassword,
  ];
  const id = req.params.userID;

  db.query(sql, [...values, id], (err, data) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Error updating user" });
    }
    console.log("Update result:", data);
    return res.json(data);
  });
});

app.post("/Register", (req, res) => {
  const sql =
    "INSERT INTO user_table (`firstName`, `lastName`, `cvsuEmail`, `username`, `password`) VALUES (?)";
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.cvsuEmail,
    req.body.username,
    req.body.password,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ error: "Error inserting data" });
    }
    return res.json(data);
  });
});

app.post("/Login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM user_table WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, data) => {
    if (err) {
      console.error("Error retrieving data: ", err);
      return res.status(500).json({ error: "Error retrieving data" });
    }
    if (data.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    return res.json(data[0]);
  });
});

app.post(
  "/entry",
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .send({ message: "File size is too large. Maximum 5MB allowed." });
        }
        if (err.code === "INVALID_FILE_TYPE") {
          return res
            .status(400)
            .send({ message: "Only image files are allowed." });
        }
        return res.status(500).send({ message: "File upload error." });
      }
      next();
    });
  },
  (req, res) => {
    const { title, description, userID, visibility, anonimity } = req.body;
    const file = req.file;

    if (!title || !description || !userID) {
      return res
        .status(400)
        .send({ message: "Title, description, and userID are required." });
    }

    let fileURL = "";
    if (file) {
      fileURL = `/uploads/${file.filename}`;
    }

    const query = `
      INSERT INTO diary_entries (title, description, userID, visibility, anonimity, fileURL)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [title, description, userID, visibility, anonimity, fileURL];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting diary entry:", err);
        return res
          .status(500)
          .send({ message: "Failed to save diary entry. Please try again." });
      }
      res.status(200).send({ message: "Entry added successfully!" });
    });
  }
);

app.get("/entries", (req, res) => {
  const userID = req.query.userID;

  const query = `
    SELECT diary_entries.entryID, diary_entries.title, diary_entries.visibility, diary_entries.anonimity, diary_entries.description, diary_entries.fileURL, user_table.username
    FROM diary_entries
    JOIN user_table ON diary_entries.userID = user_table.userID
    WHERE (diary_entries.visibility = 'public' 
    OR (diary_entries.visibility = 'private' AND diary_entries.userID = ?))
    ORDER BY diary_entries.created_at DESC; ;
  `;

  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching diary entries:", err.message);
      return res.status(500).json({ error: "Error fetching diary entries" });
    }
    res.status(200).json(results);
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
