const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();
require('dotenv').config();
let users = [];

const isValid = (username) => {   
    let usersWithSimilarName = users.filter((user) => {
        return user.username === username;
    });

    return usersWithSimilarName.length > 0;
}

const authenticatedUser = (username, password) => {
    return users.some((user) => {
        return user.username === username && user.password === password;
    });
}

// Login endpoint
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        const user = users.find(u => u.username === username); 
        const accessToken = jwt.sign({ data: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        return res.json({ accessToken: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  // Splitting the header to get the token part
  const token = authHeader.split(' ')[1];
  if (!token) {
     return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

// Verify the token
jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  if (err) {return res.status(403).json({ message: "Unauthorized: Invalid token" })};

  req.user = user.data;

  next();
});
};

// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const isbnAsNumber = Number(isbn); 
    const reviewText = req.query.review;
    const username = req.user;

    if (!books[isbnAsNumber]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbnAsNumber].reviews = books[isbnAsNumber].reviews || {};
    books[isbnAsNumber].reviews[username] = reviewText;

    res.json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const isbnAsNumber = Number(isbn);
    const username = req.user;

    if (!books[isbnAsNumber]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbnAsNumber].reviews || !books[isbnAsNumber].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbnAsNumber].reviews[username];

    res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.verifyToken = verifyToken;
