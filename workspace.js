// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyCEZUoYNe846MbRFYmZQfkH6_Pu8gJGYxM",
    authDomain: "swordenhancegame.firebaseapp.com",
    databaseURL: "https://swordenhancegame-default-rtdb.firebaseio.com/",
    projectId: "swordenhancegame",
    storageBucket: "swordenhancegame.firebasestorage.app",
    messagingSenderId: "452889860113",
    appId: "1:452889860113:web:fb018e74cedab080db39b0",
    measurementId: "G-F8BJC35Q24"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 게임 상태 변수
let gameStarted = false;
let level = 0, nickname = '', highScore = 0, money = 2500, protectCount = 0;
const successRates = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3];
const swordNames = ["그냥 소드.", "목검 소드", "날카로운 소드", "짱쎈 소드", "사춘기 소드", "카이다 소드", "PRETTY 소드", "난쟁이똥자루 소드", "석탄 코스프레", "개발자 먹는 소드", "비둘기 소드", "난쟁이목검 소드", "탈모온 소드(beta)", "메이드 소드", "엑스칼리버 소드"];

function getEnhanceCost(l) { return Math.floor(100 * Math.pow(1.25, l)); }
function isSuccess() { return Math.random() < (successRates[level] ?? 0.1); }
function getSellPrice(l) { if (l === 1) return 100; if (l === 2) return 250; if (l === 3) return 1000; let p = 1000; for (let i = 4; i <= l; i++)p *= 2; return p; }

// UI 업데이트
function updateUI() {
    document.getElementById('successRateDisplay').textContent = `${((successRates[level] ?? 0.1) * 100).toFixed(1)}%`;
    document.getElementById('currentPriceDisplay').textContent = `${getSellPrice(level)} 원`;
    document.getElementById('nextPriceDisplay').textContent = `${getSellPrice(level + 1)} 원`;
    document.getElementById('currentLevel').textContent = level;
    document.getElementById('currentLevelInfo').textContent = level;
    document.getElementById('money').textContent = money;
    document.getElementById('moneyInfo').textContent = money;
    document.getElementById('protectStatus').textContent = protectCount > 0 ? `강화 보호 아이템: ${protectCount}개` : "강화 보호 아이템: 없음";
    document.getElementById('swordImg').src = `images/sword_lv${Math.min(level, 13)}.png`;
    document.getElementById('swordName').textContent = `검 이름: ${swordNames[Math.min(level, swordNames.length - 1)]}`;
    document.getElementById('enhanceCost').textContent = getEnhanceCost(level);
    checkGameOver();
}

// 게임 시작
function startGame() {
    nickname = prompt('닉네임 입력 (최대 30자)');
    if (!nickname || nickname.length > 30) { alert("닉네임은 30자 이하!"); return; }
    nickname = nickname.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // XSS 예방
    document.getElementById('nicknameDisplay').textContent = nickname;
    document.getElementById('intro').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('shopButton').style.display = 'block';
    document.getElementById('infoBox').style.display = 'block';
    document.querySelectorAll('.gameControl').forEach(b => b.style.display = 'inline-block');
    gameStarted = true;

    // Firebase 데이터 불러오기
    db.ref('players/' + nickname).once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (data) { level = data.level; money = data.money; protectCount = data.protectCount || 0; highScore = data.highScore || level; }
            updateUI();
        })
        .catch(err => { console.warn("Firebase load fail:", err); updateUI(); });

    // 실시간 랭킹
    db.ref("ranking").orderByChild("score").limitToLast(10)
        .on("value", snapshot => {
            let list = ""; let arr = [];
            snapshot.forEach(child => arr.push(child.val()));
            arr.sort((a, b) => b.score - a.score);
            arr.forEach(d => list += `${d.nickname} : ${d.score}<br>`);
            document.getElementById("rankingBox").innerHTML = list;
        });
}
