const express = require('express');
const app = express(); 
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to my server")
})
app.get("/about", (req, res) => {
    res.send("This is the about page")
})
app.get("/users", (req, res) => {
    res.send("Here are the users")
})

app.get("/hello/:name", (req, res) =>{
    res.send(`Hello, ${req.params.name}!`)
})
app.get("/search", (req, res) => {
    console.log(req.query.q);
    res.send(`You searched: ${req.query.q}`)
})

app.get("/filter", (req, res) => {
    console.log(req.query);
    res.send(`Category: ${req.query.category} Sort: ${req.query.sort}`)
})

app.get("/products/:id", (req, res) => {
    console.log(req.params);
    res.send(`You are looking for the product with id: ${req.params.id}`)
})
app.get("/products", (req, res) => {
    console.log(req.params);
    res.send(`You searced:`)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})