// 컴투스프로야구V25 카드 성장 시뮬레이터 - 메인 애플리케이션 로직
// 앱 초기화 및 전역 이벤트 리스너 설정

document.addEventListener('DOMContentLoaded', () => {
    // domManager와 cardCalculator는 이미 전역 인스턴스로 생성되어 있습니다.
    
    // DOM이 준비된 후, DOM을 조작하는 초기화 함수들을 호출합니다.
    domManager.init();

    // 초기 카드 슬롯 추가 (기본 1개)
    domManager.addCard();
});

// 글로벌 헬퍼 함수들은 domManager.js에 정의되어 있습니다.
// setEnhancementLevel, validateIntegerInput, addCard, resetCard, closeTeamModal, closeYearModal