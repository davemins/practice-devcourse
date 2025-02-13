const express = require('express')
const app = express()

// API : GET + "https://localhost:1234/"
// Hello World
app.get('/', function (req, res) {
    res.json({
        say : 'Hello World'
    })
})

// API : GET + "https://localhost:1234/test/1"
// One!!
app.get('/test/1', function (req, res) {
    res.json({
        say : 'Hello World'
    })
})

let book = {
    name : "Node.js를 공부해보자",
    price : 20000,
    description : "좋음"
}

// API : GET + '/hello'
app.get('/hello', function (req, res) {
    res.json(book)
})


app.listen(1234)