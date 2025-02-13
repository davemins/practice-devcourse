const express = require('express')
const app = express()

app.listen(1234)

app.get('/products/:n', function (req, res) {
    res.json({
        num : req.params.n
    })
})


// 영상 타입 라인 주소 : /watch?v=asdfewfaf&t=2412s
app.get('/watch', function (req, res) {
    const q = req.query
    console.log(q)


    res.json(q)
})