const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;
app.use(express.json());

const db = new sqlite3.Database("./tasks.db");
const userDb = new sqlite3.Database("./users.db");

db.run(
  `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN DEFAULT FALSE)`,
);
userDb.run(
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, isAdmin BOOLEAN NOT NULL DEFAULT FALSE, active BOOLEAN NOT NULL DEFAULT TRUE)`,
);
app.get("/", (req, res) => {
  res.send("Hello from my express app!");
});
app.get("/users", (req, res) => {
  userDb.all("SELECT * FROM users", (error, rows) => {
    if (rows.length === 0) {
      res.status(200).json({ message: "No users in db" });
      return;
    }
    res.json(rows);
  });
});
app.get("/users/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const id = req.params.id;
  userDb.get(sql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ message: "DB error" });
    }
    if (!rows) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows);
  });
});
app.get("/users/active", (req, res) => {
  const sql = "SELECT * FROM users WHERE active = 1";
  userDb.all(sql, (error, rows) => {
    res.json(rows);
  });
});

app.get("/users/search", (req, res) => {
  const name = req.query.name;
  const sql = "SELECT * FROM users WHERE name LIKE ?";
  userDb.all(sql, [`%${name}%`], (error, rows) => {
    res.json(rows);
  });
});

app.get("/users/sorted", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY email";
  userDb.all(sql, [], (error, rows) => {
    res.json(rows);
  });
});

app.post("/users", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const active = req.body.active;

  console.log(name, email, active);
  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }
  if (name.length < 2) {
    console.log(name.length);
    res.status(400).json({ message: "Not a real name" });
    return;
  }
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }
  userDb.run(
    "INSERT INTO users (name, email, active) VALUES (?, ?, ?)",
    [name, email, active],
    (error) => {
      if (error && error.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ message: "Email already exists" });
      }
    },
  );
  res.status(201).json({ message: "User created" });
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (error, rows) => {
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const completed = req.body.completed;
  db.run(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed],
    (error) => {
      if (error) {
        console.log(error.code);
        return res.status(500).json({ error: "DB error" });
      }
    },
  );

  res.status(201).json({ message: "Task created" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
