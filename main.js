// 컴투스프로야구V25 카드 성장 시뮬레이터 - 메인 애플리케이션 로직
// 앱 초기화 및 전역 이벤트 리스너 설정

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'batter'; 
    domManager.init(type);
});

// 글로벌 헬퍼 함수들은 domManager.js에 정의되어 있습니다.
// setEnhancementLevel, validateIntegerInput, addCard, resetCard, closeTeamModal, closeYearModal
