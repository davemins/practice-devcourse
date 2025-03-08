const express = require('express')
const app = express()

app.listen(7777)

// user-demo와 channel-demo를 호출하자
const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')

app.use("/", userRouter)
app.use("/channels", channelRouter)