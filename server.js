'use strict';

/******** THIS FILE SHOULD CONTAIN ********
Dependencies: express, cors, pg
    Middleware: app.use(cors())
    API Endpoints:
        app.get('/api/v1/books'
    Client Endpoints:
        app.get('*', (req, res) => res.status(403).send('This route does not exist'));
*/

// Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;


// Database Setup

// conStrings: We will do this differently later

// Rosie conString for MAC - 'postgres://localhost:5432/books_app'; Old link

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

// Application Middleware
app.use(cors());

// API Endpoints //get all books
app.get(`/api/v1/books`, (req, res) => {
  console.log('OMG I am handling a GET request by a client!')

  let SQL = `SELECT * FROM books;`;
  client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//get one book
app.get(`api/v1/books`, (req, res) => {
    let SQL = `SELECT * FROM books;`
    client.query(SQL)
    .then(results => res.send(results.rows))
    .catch(console.error)
})

//create a book
app.post(`api/v1/books`, (req, res) => {
    let {author, title, isbn, image_url, description} = req.body;
    let SQL = `INSERT INTO books (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;
    let values = [author, title, isbn, image_url, description];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error)
})

// update a book
app.put(`api/v1/books:id`, (req, res) => {
    let {author, title, isbn, image_url, description} = req.body;
    let SQL = `UPDATE books SET (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) WHERE book_id=$6;`;
    let values = [author, title, isbn, image_url, description, req.params.id];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error)
})

//delete a book
app.delete(`api/v1/books:id`, (req, res) => {
    let {author, title, isbn, image_url, description} = req.body;
    let SQL = `DELETE FROM books (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) WHERE book_id=$6;`;
    let values = [author, title, isbn, image_url, description, req.params.id];
    client.query(SQL, values)
    .then(results => res.send(results.rows))
    .catch(console.error)
})

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`The server is alive and well and listening on port ${PORT}`));

