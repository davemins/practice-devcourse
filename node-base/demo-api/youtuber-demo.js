// express 모듈 세팅
const express = require('express')
const app = express()

app.listen(1234)

// youtuber 데이터 세팅
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

let db = new Map()
var id = 1

db.set(id++, youtuber1)
db.set(id++, youtuber2)
db.set(id++, youtuber3)

// REST API 설계
// 전체 유튜버 "조회" GET /youtubers
app.get('/youtubers', function (req, res) {
    var youtubers = {}

    if (db.size !== 0) {

        db.forEach(function(youtuber) {
            youtubers[youtuber.channelTitle] = youtuber
        })

        res.json(youtubers)
    } else {
        res.status(404).json({
            message : "조회할 유튜버가 없습니다."
        })
    }
})

// 개별 유튜버 "조회" GET /youtubers/:id
app.get('/youtubers/:id', function (req, res) {
    let {id} = req.params
    id = parseInt(id) // 문자열을 정수로 바꾼다

    const youtuber = db.get(id)

    if (youtuber == undefined) {
        res.status(404).json({
            message : "유튜버 정보를 찾을 수 없습니다."
        })
    } else {
        res.json(youtuber)
    }
})

app.use(express.json()) // http 외 모듈인 '미들웨어':json 설정

// 유튜버 "등록" POST /youtubers
app.post('/youtubers', (req, res) => {
    const channelTitle = req.body.channelTitle

    if (channelTitle) {
        // 등록
        db.set(id++, req.body)
    
        // 등록 메시지 출력
        res.status(201).json({
            message : `${db.get(id-1).channelTitle}님, 유튜버 생활을 응원합니다!`
        })
    } else {
        res.status(400).json({
            message : "이건 아니잖아.."
        })
    }
})

// 개별 유튜버 "삭제" DELETE /youtubers/:id
app.delete('/youtubers/:id', function (req, res) {
    let {id} = req.params
    id = parseInt(id) // 문자열을 정수로 바꾼다

    var youtuber = db.get(id)

    if (youtuber == undefined) {
        res.status(404).json({
            message : `요청하신 ${id}번에 해당하는 유튜버는 없습니다..`
        })
    } else {
        const channelTitle = youtuber.channelTitle
        db.delete(id)
    
        res.json({
            message : `${channelTitle}님 수고하셨습니다`
        })

    }
})

// 전체 유튜버 "삭제" DELETE /youtubers
app.delete('/youtubers', function(req, res) {

    // db에 값이 1개 이상이면, 전체 삭제
    if(db.size >= 1) {
        db.clear()
        res.json({
            message : "전체 유튜버가 삭제되었습니다."
        })
    } else { // 값이 없으면,
        res.status(404).json({
            message : "삭제할 유튜버가 없습니다."
        })
    }
})

// 개별 유튜버 "수정" PUT /youtubers/:id
app.put('/youtubers/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id)
    var oldTitble = youtuber.channelTitle
    if (youtuber == undefined) {
        res.status(404).json({
            message : `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {

        var newTitle = req.body.channelTitle 
        
        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            message : `${oldTitble}님의 채널명이 ${newTitle}로 변경되었습니다.`
        })
    }
})