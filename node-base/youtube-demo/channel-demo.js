// express 모듈 셋팅
const express = require('express')
const app = express()
app.listen(7777)
app.use(express.json()) // http 외 모듈 'json' 사용

let db = new Map()
var id = 1

app
    .route('/channels')
    .post((req, res) => {
        if (req.body.channelTitle) {
            db.set(id++, req.body)

            res.status(201).json({
                message : `${db.get(id-1).channelTitle} 채널을 응원합니다!`
            })   
        } else {
            res.status(400).json({
                message : "요청 값을 제대로 보내주세요."
            })
        }
    }) // 채널 개별 생성
    .get((req, res) => {
        if(db.size) {
            var channels = []

            db.forEach((value, key) => {
                channels.push(value)
            })
    
            res.json(channels)
        } else {
            res.status(404).json({
                message : "조회할 수 있는 채널이 없습니다."
            })
        }
    }) // 채널 전체 조회

app
    .route('/channels/:id')
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {
            res.status(200).json(channel)
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    }) // 채널 개별 조회
    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle

        if (channel) {
            var newTitle = req.body.channelTitle

            channel.channelTitle = newTitle
            db.set(id, channel)

            res.json({
                message : `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle}에서 ${newTitle}로 정상적으로 수정되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    }) // 채널 개별 수정
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {
            db.delete(id)
            res.status(200).json({
                message : `${channel.channelTitle}이 정상적으로 삭제가 되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    }) // 채널 개별 삭제