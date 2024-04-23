const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{   
    let userswithsimilarname = users.filter((user)=>{
    return user.username === username
    });

    if(userswithsimilarname.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60*60});
        req.session.authorization = {accessToken,username}
      return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", auth, (req, res) => {
    const isbn = req.params.isbn;
    const isbnAsNumber   = Number(isbn); 
    const reviewText = req.query.review; // Get review text from query
    const username = req.session.username; // Get username from session

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!books[isbnAsNumber]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    books[isbnAsNumber].reviews = books[isbnAsNumber].reviews || {};

    // Update or add the review
    books[isbnAsNumber].reviews[username] = reviewText;

    res.json({ message: "Review added/updated successfully" });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const isbnAsNumber = Number(isbn);
  const username = req.session.username;

  if (!username) {
      return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbnAsNumber]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbnAsNumber].reviews || !books[isbnAsNumber].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  // Delete the user's review
  delete books[isbnAsNumber].reviews[username]; 

  res.json({ message: "Review deleted successfully" });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
