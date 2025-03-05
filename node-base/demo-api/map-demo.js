const express = require('express')
const app = express()

app.listen(1234)

app.get('/:id', function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    if (db.get(id) == undefined) {
        return res.json({ message: "없는 상품입니다." }); // ✅ return 추가 (중복 응답 방지)
    }

    let product = db.get(id);
    product["id"] = id;

    return res.json(product); // ✅ 응답을 한 번만 보냄
});


// localhost:1234/1 => NoteBook
// localhost:1234/2 => Cup
// localhost:1234/3 => Chair

// map을 사용하여 db처럼 사용하자

let db = new Map()

let notebook = {
    productName : "Notebook",
    price : 200000
}

let cup = {
    productName : "Cup",
    price : 3000
}

let chair = {
    productName : "Chair",
    price : 100000
}

let poster = {
    productName : "Poster",
    price : 20000
}


db.set(1, notebook)
db.set(2, cup)
db.set(3, chair)
db.set(4, poster)