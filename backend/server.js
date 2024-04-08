// #region Dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

// #endregion

// #region App Setup
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// Database Connection
// const db = mysql.createConnection({
//   host: "89.138.207.15",
//   user: "root",
//   password: "charlie",
//   database: "Cookies",
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Cookies",
});

// Placeholder for storing uploaded picture filename
let picFileName = "";

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// #endregion

// #region Cookies Management
/** Route to get all cookies from the database */
app.get("/", (req, res) => {
  const sql =
    "SELECT Cookies.*, Baker.baker_name FROM Cookies JOIN Baker ON Cookies.baker_id = Baker.baker_id";
  db.query(sql, (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

/** Route to add cookies to the database */
app.post("/addCookie", (req, res) => {
  const queryString = `
    INSERT INTO Cookies (name, create_time, directions, baker_id, calories, preparation_time, bake_time, image_path, ingredients, rate_counter, rate_amount, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const data = req.body;
  const values = [
    data.cookieName,
    data.createDate,
    data.steps,
    data.baker_id,
    data.calories,
    data.prep,
    data.bakeTime,
    "/images/" + picFileName,
    data.ingredients,
    0,
    0,
    data.website,
  ];

  db.query(queryString, values, (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      res.status(200).json("Added successfully");

      console.log("Data inserted successfully:", results);
    }
  });
});

/** Route to add cookies from website to the database */
app.post("/addCookieFromWebsite", (req, res) => {
  const queryString = `
    INSERT INTO Cookies (name, create_time, directions, baker_id, calories, preparation_time, bake_time, image_path, ingredients, rate_counter, rate_amount, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const data = req.body;
  const values = [
    data.cookieName,
    data.createDate,
    data.steps,
    data.baker_id,
    data.calories,
    data.prep,
    data.bakeTime,
    data.image,
    data.ingredients,
    0,
    0,
    data.website,
  ];

  db.query(queryString, values, (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      res.status(200).json("Added successfully");
      console.log("Data inserted successfully:", results);
    }
  });
});

/** Route to edit a cookie in the database */
app.post("/editCookie", (req, res) => {
  const data = req.body;
  console.log(data);
  const updateQuery = `
    UPDATE Cookies
    SET ingredients = ?,
        directions = ?
    WHERE cookie_id = ?;
  `;
  db.query(
    updateQuery,
    [data.ingredients, data.directions, data.cookie_id],
    (error, results) => {
      if (error) {
        console.error("Error updating database: ", error);
        res.status(500).send("Error updating database");
        return;
      }
      console.log("Database updated successfully");
      res.status(200).send("Database updated successfully");
    }
  );
});

/** Route to remove a cookie from the database */
app.post("/removeCookie", (req, res) => {
  const data = req.body;
  console.log(data);
  const deleteQuery = `
    DELETE FROM Cookies
    WHERE cookie_id = ?;
  `;

  db.query(deleteQuery, [data.cookie_id], (error, results) => {
    if (error) {
      console.error("Error deleting from database: ", error);
      res.status(500).send("Error deleting from database");
      return;
    }
    console.log("Database entry deleted successfully");
    res.status(200).send("Database entry deleted successfully");
  });
});

/** Route to rate a cookie in the database */
app.post("/rateCookie", (req, res) => {
  const data = req.body;
  console.log(data);
  const updateQuery = `
    UPDATE Cookies
    SET rate_amount = rate_amount + ?,
        rate_counter = rate_counter + 1
    WHERE cookie_id = ?;
  `;
  db.query(updateQuery, [data.rateAmount, data.cookieId], (error, results) => {
    if (error) {
      console.error("Error updating database: ", error);
      res.status(500).send("Error updating database");
      return;
    }
    res.json("Cookie Rated");
  });
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Cookies/images"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    picFileName = Date.now() + path.extname(file.originalname);
    cb(null, picFileName);
  },
});

const upload = multer({ storage: storage });

/** Route to handle file upload and add picture to cookies */
app.post("/savepic", upload.single("picture"), (req, res) => {
  // Here, you can access the uploaded file details in req.file
  res.send("File uploaded successfully");
});

// #endregion

// #region Search
/** Route to search for cookies in the database based on an array of strings */
app.post("/search", (req, res) => {
  const data = req.body;
  console.log(data);

  // Construct a dynamic SQL query to search for all strings in the array
  const searchQuery = `
    SELECT *
    FROM Cookies
    WHERE (${data.searchArray.map(() => "ingredients LIKE ?").join(" AND ")})
    OR (${data.searchArray.map(() => "name LIKE ?").join(" OR ")});
  `;

  // Construct the parameter array for the prepared statement
  const params = [];
  data.searchArray.forEach((searchString) => {
    params.push(`%${searchString}%`);
    params.push(`%${searchString}%`);
  });
  // Perform the search query
  db.query(searchQuery, params, (searchError, searchResults) => {
    if (searchError) {
      console.error("Error searching for cookies: ", searchError);
      res.status(500).send("Error searching for cookies");
      return;
    }
    // Filter the results to include only cookies that have all strings in "ingredients"
    const filteredResults = searchResults.filter((cookie) => {
      return data.searchArray.every((searchString) => {
        return (
          cookie.ingredients
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          cookie.name.toLowerCase().includes(searchString.toLowerCase())
        );
      });
    });

    // Return the filtered search results
    res.json({ cookies: filteredResults });
  });
});
// #endregion

// #region User Management
/** Route to add a user to the database */
app.post("/addUser", async (req, res) => {
  const { username, email, password } = req.body;
  // Hash the password
  const hash = await bcrypt.hash(password, 10);
  const checkUserAndEmailQuery = `SELECT 1 FROM Baker WHERE baker_name = ? OR email = ?`;
  db.query(checkUserAndEmailQuery, [username, email], (err, result) => {
    if (err) {
      console.error("Error checking username and email:", err);
      res.status(500).json("Internal Server Error");
      return;
    }
    if (result.length === 0) {
      const insertUserQuery =
        "INSERT INTO Baker (baker_name, email, password_hash) VALUES (?, ?, ?)";

      db.query(insertUserQuery, [username, email, hash], (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          res.json("Internal Server Error");
          return;
        }

        console.log("User inserted successfully");
        res.json("User inserted successfully");
      });
    } else {
      console.log("Username or email already exists");
      res.json("Username or email already exists");
    }
  });
});

/** Route to handle user login */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const checkUsernameQuery = "SELECT * FROM Baker WHERE baker_name = ?";

  db.query(checkUsernameQuery, [username], async (err, result) => {
    if (err) {
      console.error("Error checking username:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (result.length === 0) {
      res.json("User not found");
      return;
    }
    const user = result[0]; // Assuming username is unique, so there is only one result

    try {
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (passwordMatch) {
        res.json({ msg: "Login successful", id: user.baker_id });
      } else {
        res.json("Incorrect password");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// #endregion

// #region Manage Cookies for a User
/** Route to get cookies for a specific user from the database */
app.get("/manageCookies", (req, res) => {
  const userId = req.query.userId;

  // SQL query to get cookies for a specific userId
  const sqlQuery = `
    SELECT * 
    FROM Cookies 
    WHERE baker_id = ?;
  `;

  // Execute the SQL query
  db.query(sqlQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching cookies:", error);
      res.status(500).json({ error: "Error fetching cookies" });
      return;
    }

    // Send the results as JSON response
    res.json(results);
  });
});

// #endregion

// Start the server
app.listen(3001, "0.0.0.0", () => {
  console.log("Server is listening on port 3001");
});
