const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;  

    // Convert isbn to number for comparison
    const isbnAsInt = Number(isbn); 

    if (books[isbnAsInt]) {
        res.json(books[isbnAsInt]);  // Send book details 
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author; 
  const matchingBooks = [];

  // Iterate through the 'books' object
  for (const bookId in books) {
      const book = books[bookId];
      if (book.author.toLowerCase() === authorName.toLowerCase()) {
          matchingBooks.push(book); 
      }
  }

  if (matchingBooks.length > 0) {
      res.json(matchingBooks);
  } else {
      res.status(404).json({ message: "No books found by this author" });
  }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const authorTitle = req.params.title; 
  const matchingBooks = [];

  // Iterate through the 'books' object
  for (const bookId in books) {
      const book = books[bookId];
      if (book.title.toLowerCase() === authorTitle.toLowerCase()) {
          matchingBooks.push(book); 
      }
  }
  if (matchingBooks.length > 0) {
      res.json(matchingBooks);
  } else {
      res.status(404).json({ message: "No books found by this author" });
  }
});


//  Get book review
  public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const isbnAsInt = Number(isbn); // Convert to a number 
  
    if (books[isbnAsInt] && books[isbnAsInt].reviews) {
      res.json(books[isbnAsInt].reviews); // Send the reviews
    } else {
      res.status(404).json({ message: "Book or reviews not found" });
    }
  });

module.exports.general = public_users;
