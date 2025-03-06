// express 모듈 셋팅
const express = require('express')
const router = express.Router() // express의 라우터로 사용할 수 있게 되었다.

// const app = express()
// app.listen(7777)
router.use(express.json()) // http 외 모듈 'json' 사용

let db = new Map()
var id = 1

// 로그인
router.post('/login', (req, res) => {
    // userId가 db에 저장된 회원인지 확인하기
    const {userId, password} = req.body
    var loginUser = {}

    db.forEach(function(user, id) {
        // a : 데이터
        // b : 인덱스
        // c : 전체
        if (user.userId === userId) {
            loginUser = user
        }
    })

    // id 값을 못 찾았으면..
    if(Object.keys(loginUser).length) {
        console.log("같은 것 찾았다.")

        // password도 맞는지 확인하기
        if (loginUser.password === password) {
            console.log("패스워드도 같다!")
            res.json({ message : "로그인 성공"})
        } else {
            console.log("패스워드는 틀렸다..")
            res.json({ message : "잘못된 패스워드 입력.."})
        }
    } else {
        console.log("없는 아이디입니다.")
        res.json({ message : "없는 아이디"})
    }
})

// 회원 가입
router.post('/join', (req, res) => {
    console.log(req.body)

    // 입력 값 검증: req.body가 없거나, name이 없으면 에러 반환
    if (!req.body || !req.body.name) {
        return res.status(400).json({
            message: `입력 값을 다시 확인해주세요.`
        })
    }

    // 회원 정보를 Map에 저장
    db.set(id, req.body)

    res.status(201).json({
        message: `${db.get(id++).name}님 환영합니다.`
    })
})

// 회원 개별 조회
router.get('/users/:id', (req, res) => {
    let {id} = req.params
    id = parseInt(id)

    const user = db.get(id)

    if (user == undefined) {
        res.status(404).json({
            message : `유저 정보를 찾을 수 없습니다.`
        })
    } else {
        res.status(200).json({
            userId : user.userId,
            name : user.name
        })
    }
})

// 회원 개별 탈퇴
router.delete('/users/:id', (req, res) => {

    let {id} = req.params
    id = parseInt(id)

    const user = db.get(id)

    if (user == undefined) {
        res.status(404).json({
            message : `유저 정보를 찾을 수 없습니다.`
        })
    } else {
        db.delete(id)
        
        res.status(200).json({
            message : `${user.name}님 다음에 또 뵙겠습니다.`
        })
    }
})

module.exports = router