// Express 모듈을 가져와서 변수 express에 저장
const express = require('express')

// Express 애플리케이션을 생성하여 app 변수에 저장
const app = express()

// 서버가 실행될 포트 번호를 지정 (1234번 포트에서 실행)
const port = 1234

// GET 요청을 처리하는 라우트 정의
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())

// POST 요청을 처리하는 라우트 정의
app.post('/test', function (req, res) {
  // Body에 숨겨져서 들어온 데이터를 화면에 출력해보자

  console.log(req.body)
  res.json(req.body)
})

// Express 애플리케이션을 지정한 포트에서 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})