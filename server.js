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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})