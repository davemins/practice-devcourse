const express = require('express')
const app = express()

app.listen(1234)

let youtuber1 = {
    channelTitle : "십오야",
    sub : "593만명",
    videoNum : "993개"
}

let youtuber2 = {
    channelTitle : "침착맨",
    sub : "227만명",
    videoNum : "6.6천개"
}

let youtuber3 = {
    channelTitle : "테오",
    sub : "54.8만명",
    videoNum : "726개"
}

app.get('/:nickname', function(req, res) {
    const {nickname} = req.params

    if (nickname == "@15") {
        res.json(youtuber1)
    } else if (nickname == "@Chim") {
        res.json(youtuber2)
    } else if (nickname == "@Teo") {
        res.json(youtuber3)
    }
})