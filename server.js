const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;

// JSON 데이터를 받기 위해 설정
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 일정 불러오기
app.get('/api/schedules', (req, res) => {
    fs.readFile(path.join(__dirname, 'schedules.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read schedules' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// 일정 저장
app.post('/api/schedules', (req, res) => {
    fs.writeFile(path.join(__dirname, 'schedules.json'), JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to save schedules' });
        } else {
            res.json({ message: 'Schedules saved successfully' });
        }
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
