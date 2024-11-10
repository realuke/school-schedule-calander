let currentDate = new Date();
const calendar = document.getElementById('calendar');
let selectedDate = formatDate(currentDate); // 초기 선택 날짜 포맷을 YYYY-MM-DD로 설정
let schedules = {};

// Pikaday 설정
const picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'YYYY-MM-DD',
    toString(date) {
        return moment(date).format('YYYY-MM-DD'); // Moment.js로 포맷 설정
    },
    parse(dateString) {
        return moment(dateString, 'YYYY-MM-DD').toDate(); // 문자열을 Date 객체로 변환
    }
});

// JSON 파일에서 일정 로드
async function loadSchedules() {
    const response = await fetch('/api/schedules');
    if (response.ok) {
        schedules = await response.json();
        displayCalendar();
        displaySchedules();
    }
}


// 현재 월과 연도를 표시
function displayCurrentMonthYear() {
    const monthYear = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    document.getElementById('currentMonthYear').textContent = monthYear;
}

// 캘린더 표시
function displayCalendar() {
    displayCurrentMonthYear();
    calendar.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= firstDayOfMonth + daysInMonth; i++) {
        const dayElement = document.createElement('div');
        if (i > firstDayOfMonth) {
            const day = i - firstDayOfMonth;
            const date = new Date(year, month, day);
            const dateString = formatDate(date);
            dayElement.className = 'day' + (dateString === selectedDate ? ' selected' : '');
            dayElement.innerHTML = `<div>${day}</div>`;
          
            if (schedules[dateString]) {
                dayElement.innerHTML += `<small>📅 ${schedules[dateString].length} </small>`;
            }
  
            dayElement.onclick = () => selectDate(dateString);
        }
        calendar.appendChild(dayElement);
    }
}

// 날짜 선택
function selectDate(dateString) {
    selectedDate = dateString;
    document.getElementById('selectedDateDisplay').innerText = dateString;
    displaySchedules();
    displayCalendar();
}

// 카카오톡 SDK 초기화
Kakao.init('5aadd5712152d3218c8a2294125235a8'); // 자신의 카카오 앱 키로 변경

// 일정 삭제와 공유 버튼 추가
function displaySchedules() {
const scheduleList = document.getElementById('scheduleList');
scheduleList.innerHTML = '';
if (schedules[selectedDate]) {
    schedules[selectedDate].forEach((item, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        // 일정 항목
        scheduleItem.innerHTML = `${item} 
        <button onclick="removeSchedule(${index})">제거</button>
        <button onclick="shareSchedule('${item}')">카카오톡 공유</button>`;
        
        scheduleList.appendChild(scheduleItem);
    });
}
}

// 카카오톡 공유 기능
function shareSchedule(scheduleText) {
    const message = `${selectedDate}의 일정: ${scheduleText}`;
    
    // 카카오톡 공유 API 호출
    Kakao.Link.sendDefault({
        objectType: 'feed', // 피드 형태로 공유
        content: {
            title: message,
            description: '일정 확인을 위한 링크입니다.',
            imageUrl: 'https://your-image-url.com', // 이미지 URL (필요시 추가)
            link: {
                mobileWebUrl: window.location.href, // 현재 웹페이지 링크 (모바일 웹)
                webUrl: window.location.href // 현재 웹페이지 링크 (PC 웹)
            }
        },
        buttons: [
            {
                title: '일정 확인하기', // 버튼 제목
                link: {
                    mobileWebUrl: window.location.href, // 버튼 클릭 시 이동할 URL
                    webUrl: window.location.href // 버튼 클릭 시 이동할 URL
                }
            }
        ]
    });
}

// 일정 추가
function addSchedule() {
    const scheduleText = document.getElementById('scheduleInput').value.trim();
    const scheduleDate = picker.toString();
    
    if (scheduleDate && scheduleText) {
        if (!schedules[scheduleDate]) schedules[scheduleDate] = [];
        schedules[scheduleDate].push(scheduleText);
        document.getElementById('scheduleInput').value = '';
        if (scheduleDate === selectedDate) displaySchedules();
        displayCalendar();
        saveSchedules();
    }
}

// 일정 삭제
function removeSchedule(index) {
    schedules[selectedDate].splice(index, 1);
    if (schedules[selectedDate].length === 0) delete schedules[selectedDate];
    displayCalendar();
    displaySchedules();
    saveSchedules();
}

// 일정 저장
async function saveSchedules() {
    await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedules, null, 2)
    });
}

// 월 변경
function changeMonth(change) {
    currentDate.setMonth(currentDate.getMonth() + change);
    displayCalendar();
}

// 날짜 포맷을 YYYY-MM-DD로 설정, +1 해줌
function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate()+1)
    return date.toISOString().split('T')[0];
}   


loadSchedules();