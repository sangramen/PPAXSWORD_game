// 강화
function enhanceSword() {
    const cost = getEnhanceCost(level);
    if (money < cost) { alert(`강화비용 ${cost}원이 부족!`); return; }
    money -= cost; playEnhanceTrySound();
    if (isSuccess()) {
        level++; if (level > highScore) highScore = level; playSound(true); alert(`성공! 레벨+${level}`);
    } else {
        if (protectCount > 0) { protectCount--; alert("보호 아이템 덕분에 파괴되지 않았습니다."); }
        else { level = 0; alert("실패! 소드 파괴"); }
        playSound(false);
    }
    savePlayerState(); saveHighScore(); updateUI();
}

// 판매
function sellSword() {
    if (level < 1) { alert("레벨 0 소드는 판매 불가"); return; }
    const price = getSellPrice(level); money += price; level = 0;
    alert(`${price}원 획득!`); playSellSound(); updateUI(); savePlayerState(); saveHighScore();
}

// 보호 아이템 구매
function buyProtectItem() {
    if (money < 3000) { alert("3000원 부족"); return; }
    money -= 3000; protectCount++; alert("보호 아이템 구매!");
    playBuyProtectSound(); savePlayerState();
}

// 상태 저장
function savePlayerState() { try { db.ref('players/' + nickname).set({ level, money, protectCount, highScore }); } catch (e) { console.warn(e); } }
function saveHighScore() { try { db.ref('ranking/' + nickname).set({ nickname, score: highScore }); } catch (e) { console.warn(e); } }