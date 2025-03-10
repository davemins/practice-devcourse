// express 모듈 셋팅
const express = require('express')
const router = express.Router() // express의 라우터로 사용할 수 있게 되었다.

// db 활용
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator')

// const app = express()
// app.listen(7777)
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

// 로그인
router.post(
    '/login',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ],
    (req, res) => {
        // userId가 db에 저장된 회원인지 확인하기
        const { email, password } = req.body

        conn.query(
            `SELECT * FROM users WHERE email = ?`, email,
            function (err, results) {
                if (err)
                    return res.status(400).end();

                var loginUser = results[0];
                if (loginUser && loginUser.password === password) {
                    res.status(200).json({ message: "로그인 성공" })
                } else {
                    res.status(404).json({ messgae: "이메일 또는 비밀번호가 틀렸습니다." })
                }
            }
        )

        // db.forEach(function (user, id) {
        //     // a : 데이터
        //     // b : 인덱스
        //     // c : 전체
        //     if (user.userId === userId) {
        //         loginUser = user
        //     }
        // })

        // // id 값을 못 찾았으면..
        // if (Object.keys(loginUser).length) {
        //     // password도 맞는지 확인하기
        //     if (loginUser.password === password) {
        //         res.status(200).json({ message: "로그인 성공" })
        //     } else {
        //         console.log("패스워드는 틀렸다..")
        //         res.status(400).json({ message: "잘못된 패스워드 입력.." })
        //     }
        // } else {
        //     console.log("없는 아이디입니다.")
        //     res.status(404).json({ message: "없는 아이디" })
        // }
    })

// 회원 가입
router.post(
    '/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('name').notEmpty().isString().withMessage('이름 확인 필요'),
        body('pwd').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
        validate
    ],
    (req, res) => {
        // 입력 값 검증: req.body가 없거나, name이 없으면 에러 반환
        const { email, name, pwd, contact } = req.body

        conn.query(
            `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`, [email, name, pwd, contact],
            function (err, results) {
                if (err)
                    return res.status(400).end();

                res.status(201).json(results)
            })

    })

// 회원 개별 조회
router.get('/users',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        validate
    ],
    (req, res) => {
        let { email } = req.body

        conn.query(
            `SELECT * FROM users WHERE email = ?`, email,
            function (err, results) {
                if (err)
                    return res.status(400).end();
                res.status(200).json(results)
            }
        )
    })

// 회원 개별 탈퇴
router.delete('/users',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        validate
    ],
    (req, res) => {
        let { email } = req.body

        conn.query(
            `DELETE FROM users WHERE email = ?`, email,
            function (err, results) {
                if (err)
                    {console.log(err)
                    return res.status(400).end()}
                if (results.affectedRows == 0)
                    {console.log(results)
                    return res.status(400).end()}
                else res.status(200).json(results)

            }
        )

        // if (user) {
        //     db.delete(id)

        //     res.status(200).json({
        //         message: `${user.name}님 다음에 또 뵙겠습니다.`
        //     })
        // } else {
        //     res.status(404).json({
        //         message: `유저 정보를 찾을 수 없습니다.`
        //     })
        // }
    })

module.exports = router