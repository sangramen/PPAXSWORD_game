// 강화
function enhanceSword() {
    const cost = getEnhanceCost(level);
    if (money < cost) { alert(`강화비용 ${cost}원이 없.. ㅋ`); return; }
    money -= cost; playEnhanceTrySound();
    if (isSuccess()) {
        level++; if (level > highScore) highScore = level; playSound(true); alert(`성공! 레벨+${level}`);
    } else {
        if (protectCount > 0) { protectCount--; alert("소드 대신 87세 김미시 할머니의 갑옷이 폭@8!!!!!!"); }
        else { level = 0; alert("실패! 소드가 폭@8!!!"); }
        playSound(false);
    }
    savePlayerState(); saveHighScore(); updateUI();
}

// 판매
function sellSword() {
    if (level < 1) { alert("레벨 0 소드를 누가 사요 무제한인데;"); return; }
    const price = getSellPrice(level); money += price; level = 0;
    alert(`${price}원 획득!`); playSellSound(); updateUI(); savePlayerState(); saveHighScore();
}

// 보호 아이템 구매
function buyProtectItem() {
    if (money < 3000) { alert("3000원 부족 ㅋ"); return; }
    money -= 3000; protectCount++; alert("미시 갑옷 야미 ㅋㅋ");
    playBuyProtectSound(); savePlayerState();
}

// 상태 저장
function savePlayerState() { try { db.ref('players/' + nickname).set({ level, money, protectCount, highScore }); } catch (e) { console.warn(e); } }
function saveHighScore() { try { db.ref('ranking/' + nickname).set({ nickname, score: highScore }); } catch (e) { console.warn(e); } }