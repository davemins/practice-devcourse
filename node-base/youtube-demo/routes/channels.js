// express 모듈 셋팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator')

router.use(express.json()) // http 외 모듈 'json' 사용

// 미들웨어 모듈화
const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next(); // 다음 할 일 찾아가라
    } else {
        return res.status(400).json(err.array())

    }
}

router
    .route('/')
    // 채널 개별 생성
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 팔요'),
            body('name').notEmpty().isString().withMessage('문자 입력 필요'),
            validate
        ]
        , (req, res) => {

            const { name, userId } = req.body

            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
            let values = [name, userId]

            conn.query(sql, values,
                function (err, results) {
                    if (err)
                        return res.status(400).end();
                    res.status(201).json(results)
                }
            )
        })
    // 채널 전체 조회
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 팔요'),
            validate
        ]
        , (req, res, next) => {

            var { userId } = req.body

            let sql = `SELECT * FROM channels WHERE user_id = ?`
            conn.query(sql, userId,
                function (err, results) {
                    if (err)
                        return res.status(400).end();


                    if (results.length) {
                        res.status(200).json(results)
                    } else { notFoundChannel(res) }
                }
            )

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
    .get(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ]
        , (req, res) => {

            let { id } = req.params
            id = parseInt(id)

            let sql = `SELECT * FROM channels WHERE id = ?`
            conn.query(sql, id,
                function (err, results) {

                    if (err)
                        return res.status(400).end();


                    if (results.length)
                        res.status(200).json(results)
                    else { notFoundChannel(res) }
                }
            )
        })
    // 채널 개별 수정
    .put(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ]
        , (req, res) => {

            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            let sql = `UPDATE channels SET name = ? WHERE id = ?`
            let values = [name, id]
            conn.query(sql, values,
                function (err, results) {

                    if (err)
                        return res.status(400).end();


                    if (results.affectedRows == 0)
                        return res.status(400).end()
                    else res.status(200).json(results)

                }
            )

            // var channel = db.get(id)
            // var oldTitle = channel.channelTitle

            // if (channel) {
            //     var newTitle = req.body.channelTitle

            //     channel.channelTitle = newTitle
            //     db.set(id, channel)

            //     res.json({
            //         message: `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle}에서 ${newTitle}로 정상적으로 수정되었습니다.`
            //     })
            // } else { notFoundChannel(res) }
        })
    // 채널 개별 삭제
    .delete(param('id').notEmpty().withMessage('채널 id 필요')
        , (req, res) => {

            let { id } = req.params
            id = parseInt(id)

            conn.query(
                `DELETE FROM channels WHERE id = ?`, id,
                function (err, results) {
                    if (err)
                        return res.status(400).end();
                    if (results.affectedRows == 0)
                        return res.status(400).end()
                    else res.status(200).json(results)
                }
            )


            // var channel = db.get(id)
            // if (channel) {
            //     db.delete(id)
            //     res.status(200).json({
            //         message: `${channel.channelTitle}이 정상적으로 삭제가 되었습니다.`
            //     })
            // } else { notFoundChannel(res) }
        })

function notFoundChannel(res) {
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}



module.exports = router