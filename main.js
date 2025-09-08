// 컴투스프로야구V25 카드 성장 시뮬레이터 - 메인 애플리케이션 로직
// 앱 초기화 및 전역 이벤트 리스너 설정

document.addEventListener('DOMContentLoaded', () => {
    // domManager와 cardCalculator는 이미 전역 인스턴스로 생성되어 있습니다.
    
    // DOM이 준비된 후, DOM을 조작하는 초기화 함수들을 호출합니다.
    domManager.init();

    // 초기 카드 슬롯 추가 (기본 1개)
    const cardSlotsContainer = document.getElementById('card-slots-container');
    if (cardSlotsContainer) {
        cardSlotsContainer.innerHTML = domManager.generateCardSlotHTML(1);
        // 이벤트 리스너 및 초기 등급 변경 처리는 HTML이 DOM에 추가된 후에 호출
        domManager.setupCardEventListeners(1);
        domManager.handleGradeChange(1); // 초기 카드에 대한 등급 변경 처리
        domManager.updateAddCardButton();
        // 초기 카드 데이터 업데이트 (모든 설정이 완료된 후)
        domManager.updateCardData(1);
    }
});

// 글로벌 헬퍼 함수들은 domManager.js에 정의되어 있습니다.
// setEnhancementLevel, validateIntegerInput, addCard, resetCard, closeTeamModal, closeYearModal
