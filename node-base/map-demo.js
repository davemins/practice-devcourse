const express = require('express')
const app = express()

app.listen(1234)

app.get('/:id',function (req, res) {
    let {id} = req.params
    id = parseInt(id)
    
    if (db.get(id) == undefined) {
        res.json({
            message: "없는 상품입니다."
        })
    } else {
        res.json({
            id : id,
            productName : db.get(id)
        })
    }
})

// localhost:1234/1 => NoteBook
// localhost:1234/2 => Cup
// localhost:1234/3 => Chair

// map을 사용하여 db처럼 사용하자

let db = new Map()

db.set(1, "NoteBook")
db.set(2, "Cup")
db.set(3, "Chair")