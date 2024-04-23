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

  

// GETTING ALL BOOKS AVAILABLE

public_users.get('/', async (req, res) =>{
  res.send(JSON.stringify(books, null, 4));
});


// GETTING BOOK BY ISBN

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const isbnAsInt = Number(isbn);

  const bookPromise = new Promise((resolve, reject) => {
      if (books[isbnAsInt]) {
          resolve(books[isbnAsInt]);
      } else {
          reject({ message: "Book not found" });
      }
  });

  bookPromise
      .then((bookDetails) => res.json(bookDetails))
      .catch((error) => res.status(404).json(error));
});



//GETTING A BOOK BY AUTHOR

public_users.get('/author/:author', function(req, res){
  const name = new type(arguments); // Not sure what the purpose of this line is
  const authorName = req.params.author.toLowerCase();

  // Simulate asynchronous book fetching
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchingBooks = Object.values(books).filter((book) =>
          book.author.toLowerCase() === authorName
        );

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by this author"));
        }
      }, 500); // Simulate a 500ms delay
    });
  };

  getBooks()
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});



//GETTING A BOOK BY TITLE

public_users.get('/title/:title', function (req, res) {
  const authorTitle = req.params.title.toLowerCase();

  // Simulate asynchronous book fetching
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchingBooks = Object.values(books).filter((book) =>
          book.title.toLowerCase() === authorTitle
        );

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by this title"));
        }
      }, 500); // Simulate a 500ms delay
    });
  };

  getBooks()
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
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
