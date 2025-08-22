// 효과음
function playEnhanceTrySound() { const s = document.getElementById('enhanceTrySound'); if (s) { s.currentTime = 0; s.play().catch(() => { }); } }
function playSound(success) { const s = document.getElementById(success ? 'successSound' : 'failSound'); if (s) { s.currentTime = 0; s.play().catch(() => { }); } }
function playSellSound() { const s = document.getElementById('sellSound'); if (s) { s.currentTime = 0; s.play().catch(() => { }); } }
function playBuyProtectSound() { const s = document.getElementById('buyProtectSound'); if (s) { s.currentTime = 0; s.play().catch(() => { }); } }

// 상점 열기/닫기
function openShop() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('rankingBox').style.display = 'none';
    document.getElementById('shopArea').style.display = 'block';
    document.getElementById('shopButton').style.display = 'none';
}
function closeShop() {
    document.getElementById('shopArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('rankingBox').style.display = 'block';
    document.getElementById('shopButton').style.display = 'block';
    updateUI();
}

// 게임 오버
function checkGameOver() { if (!gameStarted) return; if (money < 225 && level === 0) { triggerGameOver(); } }
function triggerGameOver() {
    const screen = document.getElementById('gameOverScreen');
    const video = document.getElementById('gameOverVideo');
    screen.style.display = 'flex';
    video.play().catch(() => { }); // 영상 없으면 넘어감
    video.onended = () => { level = 0; money = 2500; protectCount = 0; updateUI(); alert("GAME OVER - 다시 시작 가능"); screen.style.display = 'none'; }
}