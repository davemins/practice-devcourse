require('dotenv').config(); // 환경 변수 로드
const express = require('express');
const axios = require('axios');

const app = express();

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;
const state = "RANDOM_STATE";
const redirectURI = encodeURIComponent(process.env.NAVER_CALLBACK_URL);

// 네이버 로그인 URL 생성
app.get('/naverlogin', (req, res) => {
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
    
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(`<a href="${api_url}"><img height="50" src="http://static.nid.naver.com/oauth/small_g_in.PNG"/></a>`);
});

// 네이버 OAuth 콜백 처리
app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).json({ error: "Invalid request: Missing code or state" });
    }

    try {
        const token_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

        const response = await axios.get(token_url, {
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get access token" });
    }
});

// 서버 실행
app.listen(3000, () => {
    console.log('🚀 Server running at http://127.0.0.1:3000/naverlogin');
});
