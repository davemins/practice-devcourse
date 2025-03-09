// express 모듈 셋팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { body, validationResult } = require('express-validator')

router.use(express.json()) // http 외 모듈 'json' 사용

let db = new Map()
var id = 1

router
    .route('/')
    // 채널 개별 생성
    .post(
        body('userId').notEmpty().isInt().withMessage('숫자 입력하자!')
        ,(req, res) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                console.log(err.array())
            }

        if (req.body.name) {
            const { name, userId } = req.body

            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
            let values = [name, userId]

            conn.query(sql, values,
                function (err, results) {
                    res.status(201).json(results)
                }
            )

            //     res.status(201).json({
            //         message: `${db.get(id - 1).channelTitle} 채널을 응원합니다!`
            //     })
            // } else {
            //     res.status(400).json({
            //         message: "요청 값을 제대로 보내주세요."
            //     })
        } else {
            res.status(400).json({
                message: "요청 값을 제대로 보내주세요."
            })

        }
    })
    // 채널 전체 조회
    .get((req, res) => {
        var { userId } = req.body

        let sql = `SELECT * FROM channels WHERE user_id = ?`
        if (userId) {
            conn.query(sql, userId,
                function (err, results) {
                    if (results.length) {
                        res.status(200).json(results)
                    } else { notFoundChannel(res) }
                }
            )
        }

        // if (db.size && userId) {

        //     db.forEach((value, key) => {
        //         if (value.userId === userId)
        //             channels.push(value)
        //     })
        //     // 예외 처리 2가지
        //     // 1) userId가 body에 없으면
        //     // 2) userId가 가진 채널이 없으면
        //     if (channels.length) {
        //         res.status(200).json(channels)
        //     } else { notFoundChannel(res) }
        // } else { notFoundChannel(res) }
    })

router
    .route('/:id')
    // 채널 개별 조회
    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        let sql = `SELECT * FROM channels WHERE id = ?`
        conn.query(sql, id,
            function (err, results) {
                if (results.length)
                    res.status(200).json(results)
                else { notFoundChannel(res) }
            }
        )
    })
    // 채널 개별 수정
    .put((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle

        if (channel) {
            var newTitle = req.body.channelTitle

            channel.channelTitle = newTitle
            db.set(id, channel)

            res.json({
                message: `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle}에서 ${newTitle}로 정상적으로 수정되었습니다.`
            })
        } else { notFoundChannel(res) }
    })
    // 채널 개별 삭제
    .delete((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {
            db.delete(id)
            res.status(200).json({
                message: `${channel.channelTitle}이 정상적으로 삭제가 되었습니다.`
            })
        } else { notFoundChannel(res) }
    })

function notFoundChannel(res) {
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router