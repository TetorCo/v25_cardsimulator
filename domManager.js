// 컴투스프로야구V25 카드 성장 시뮬레이터 - DOM 관리
// UI 요소 생성, 업데이트, 이벤트 처리를 담당하는 모듈

const GRADES = ['라이브', '라이브 올스타', '시즌', '임팩트', '시그니처', '골든글러브', '국가대표'];
const POSITIONS = {
    'IF': '내야수',
    'OF': '외야수',
    'C': '포수',
    'DH': '지명타자',
    'SP': '선발투수',
    'RP': '중계투수',
    'CP': '마무리투수'
};

class DOMManager {
    constructor() {
        this.currentCardCount = 1;
        this.maxCards = MAX_CARDS;
        this.selectedTeam = null; // 전역 선택 팀
        this.selectedYear = null; // 전역 선택 연도
        this.activeModalTargetCardId = null; // 모달 호출 카드 ID
    }

    // 초기화
    init() {
        this.populateTeamButtons();
        this.populateYearButtons();
        this.populateGradeButtons();
        this.populatePositionButtons();
    }

    openTeamModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
        this.openModal('team-selection-modal');
    }

    openYearModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
        this.openModal('year-selection-modal');
    }

    openTeamModalForGlobal() {
        this.activeModalTargetCardId = null;
        this.openModal('team-selection-modal');
    }

    openYearModalForGlobal() {
        this.activeModalTargetCardId = null;
        this.openModal('year-selection-modal');
    }

    openGradeModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
        this.openModal('grade-selection-modal');
    }

    openPositionModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
        this.openModal('position-selection-modal');
    }

    // 특정 카드의 모든 이벤트 리스너 설정
    setupCardEventListeners(cardId) {
        // 종류(grade) 변경 리스너
        const gradeSelect = document.getElementById(`grade-${cardId}`);
        if (gradeSelect) {
            gradeSelect.addEventListener('change', () => this.handleGradeChange(cardId));
        }

        // 등급(star) 변경 리스너
        const starSelect = document.getElementById(`star-rating-${cardId}`);
        if (starSelect) {
            starSelect.addEventListener('change', () => this.updateCardData(cardId));
        }

        // 기본 정보 입력 리스너 (선수명, 팀, 연도)
        const playerInfoInputs = document.querySelectorAll(`#player-name-${cardId}, #team-${cardId}, #year-${cardId}`);
        playerInfoInputs.forEach(input => {
            input.addEventListener('input', () => this.updateCardData(cardId));
        });

        // 기본 능력치 입력 리스너
        const baseStatInputs = document.querySelectorAll(`#batter-stats-${cardId} input, #pitcher-stats-${cardId} input`);
        baseStatInputs.forEach(input => {
            input.addEventListener('input', () => this.updateCardData(cardId));
        });

        // 훈련 포인트 입력 리스너
        const trainingInputs = document.querySelectorAll(`#training-batter-${cardId} input, #training-pitcher-${cardId} input`);
        trainingInputs.forEach(input => {
            input.addEventListener('input', () => this.updateTrainingPointsInfo(cardId, input));
        });

        // 강화 레벨 버튼들은 onclick 이벤트로 처리됨 (HTML에 직접 정의)
    }

    // 종류(grade) 변경 시 등급(star) 드롭다운 처리
    handleGradeChange(cardId) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const starSelect = document.getElementById(`star-rating-${cardId}`);

        starSelect.innerHTML = '';
        starSelect.disabled = true;

        if (grade && MAX_TRAINING_POINTS[grade]) {
            const availableStars = Object.keys(MAX_TRAINING_POINTS[grade]);

            availableStars.forEach(star => {
                const option = document.createElement('option');
                option.value = star;
                option.text = `${star}등급`;
                starSelect.add(option);
            });

            if (availableStars.length === 1) {
                starSelect.value = availableStars[0];
                this.updateCardData(cardId);
            } else if (availableStars.length > 1) {
                const placeholder = document.createElement('option');
                placeholder.value = "";
                placeholder.text = "등급 선택";
                placeholder.disabled = true;
                placeholder.selected = true;
                starSelect.prepend(placeholder);
                this.updateCardData(cardId);
            }
            starSelect.disabled = false;
        } else {
            const placeholder = document.createElement('option');
            placeholder.value = "";
            placeholder.text = "종류 필요";
            starSelect.add(placeholder);
            starSelect.disabled = true;
            this.updateCardData(cardId);
        }
    }

    // 훈련 포인트 정보 업데이트 및 입력 제한
    updateTrainingPointsInfo(cardId, currentInput = null) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const star = document.getElementById(`star-rating-${cardId}`).value;
        
        let maxPoints = 0;
        if (grade && star && MAX_TRAINING_POINTS[grade] && MAX_TRAINING_POINTS[grade][star]) {
            maxPoints = MAX_TRAINING_POINTS[grade][star];
        }

        document.getElementById(`max-points-${cardId}`).textContent = maxPoints;

        const trainingInputs = document.querySelectorAll(`#training-batter-${cardId} input, #training-pitcher-${cardId} input`);
        let currentSum = 0;
        trainingInputs.forEach(input => {
            // Set the max attribute dynamically
            input.setAttribute('max', maxPoints);
            currentSum += parseInt(input.value) || 0;
        });

        if (currentInput && currentSum > maxPoints) {
            const overage = currentSum - maxPoints;
            const currentInputVal = parseInt(currentInput.value) || 0;
            currentInput.value = Math.max(0, currentInputVal - overage);
            currentSum -= overage;
        }

        const remainingPoints = maxPoints - currentSum;
        const remainingPointsEl = document.getElementById(`remaining-points-${cardId}`);
        remainingPointsEl.textContent = remainingPoints;

        if (remainingPoints < 0) {
            remainingPointsEl.classList.add('text-red-400');
        } else {
            remainingPointsEl.classList.remove('text-red-400');
        }
    }

    // 포지션에 따른 스탯 표시 전환
    // 포지션에 따른 스탯 표시 전환
    togglePositionStats(cardId) {
        const position = document.getElementById(`position-${cardId}`).value;
        const isPitcher = ['SP', 'RP', 'CP'].includes(position);
        
        const batterStats = document.getElementById(`batter-stats-${cardId}`);
        const pitcherStats = document.getElementById(`pitcher-stats-${cardId}`);
        const batterTraining = document.getElementById(`training-batter-${cardId}`);
        const pitcherTraining = document.getElementById(`training-pitcher-${cardId}`);
        
        if (isPitcher) {
            batterStats.classList.add('hidden');
            pitcherStats.classList.remove('hidden');
            batterTraining.classList.add('hidden');
            pitcherTraining.classList.remove('hidden');
        } else {
            batterStats.classList.remove('hidden');
            pitcherStats.classList.add('hidden');
            batterTraining.classList.remove('hidden');
            pitcherTraining.classList.add('hidden');
        }
    }

    // 카드 데이터 업데이트의 메인 함수
    updateCardData(cardId) {
        this.updateGrowthFactorsAvailability(cardId);
        const cardData = this.collectCardData(cardId);
        
        if (cardData) {
            cardCalculator.updateCard(cardData);
            this.updateFinalStatsDisplay(cardId);
            this.updateComparisonSection();
        } else {
            this.clearFinalStatsDisplay(cardId);
        }
        this.updateTrainingPointsInfo(cardId);
    }

    // 성장 요소 섹션 활성화/비활성화
    updateGrowthFactorsAvailability(cardId) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const star = document.getElementById(`star-rating-${cardId}`).value;
        const growthFactorsFieldset = document.getElementById(`growth-factors-${cardId}`);

        growthFactorsFieldset.disabled = !(grade && star);
    }

    // DOM에서 카드 데이터 수집
    collectCardData(cardId) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const star = document.getElementById(`star-rating-${cardId}`).value;
        
        // 필수 정보 (종류, 등급)가 없으면 데이터 수집 중단
        if (!grade || !star) return null;

        const playerName = document.getElementById(`player-name-${cardId}`).value;
        const team = document.getElementById(`team-${cardId}`).value;
        const year = document.getElementById(`year-${cardId}`).value;
        const position = document.getElementById(`position-${cardId}`).value;
        const isPitcher = ['SP', 'RP', 'CP'].includes(position);
        const baseStats = {};
        const trainingDistribution = {};

        const statTypes = isPitcher 
            ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] 
            : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];

        statTypes.forEach(stat => {
            baseStats[stat] = parseInt(document.getElementById(`${stat}-${cardId}`).value) || 0;
            trainingDistribution[stat] = parseInt(document.getElementById(`training-${stat}-${cardId}`).value) || 0;
        });

        return {
            id: cardId,
            isActive: true,
            playerInfo: { name: playerName, team: team, year: year, grade: grade, star: star, position: position },
            baseStats: baseStats,
            growthFactors: {
                enhancementLevel: parseInt(document.getElementById(`enhancement-level-${cardId}`).value) || 0,
                trainingDistribution: trainingDistribution
            },
            finalStats: {}
        };
    }

    // 최종 능력치 표시 업데이트
    updateFinalStatsDisplay(cardId) {
        const cardData = cardCalculator.cards.find(card => card.id === cardId);
        if (!cardData || !cardData.finalStats) return;

        const finalStatsContainer = document.getElementById(`final-stats-${cardId}`);
        if (!finalStatsContainer) return;

        const isPitcher = cardData.playerInfo.position === 'P';
        const stats = isPitcher ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
        const statLabels = isPitcher ? ['구속', '제구', '구위', '변화', '지구력', '수비'] : ['파워', '정확', '선구', '주루', '인내', '수비'];

        let html = '';
        stats.forEach((stat, index) => {
            const value = cardData.finalStats[stat] || 0;
            html += `<div class="text-center"><div class="text-sm text-secondary">${statLabels[index]}</div><div class="text-lg font-semibold accent-blue">${value}</div></div>`;
        });
        finalStatsContainer.innerHTML = html;
    }

    // 최종 능력치 표시 초기화
    clearFinalStatsDisplay(cardId) {
        const finalStatsContainer = document.getElementById(`final-stats-${cardId}`);
        if (finalStatsContainer) {
            finalStatsContainer.innerHTML = '';
        }
    }

    // 카드 추가
    addCard() {
        if (this.currentCardCount >= this.maxCards) {
            alert(`최대 ${this.maxCards}장까지만 추가할 수 있습니다.`);
            return;
        }
        this.currentCardCount++;
        const newCardId = this.currentCardCount;
        const container = document.getElementById('card-slots-container');
        container.insertAdjacentHTML('beforeend', this.generateCardSlotHTML(newCardId));
        this.setupCardEventListeners(newCardId);
        this.handleGradeChange(newCardId);
        this.updateAddCardButton();
    }

    generateCardSlotHTML(cardId) {
        // Helper function to generate stat input fields
        const generateStatInputs = (id, stats, labels, prefix = '') => {
            return stats.map((stat, i) => `<div><label class="block text-sm text-secondary mb-1">${labels[i]}</label><input type="number" id="${prefix}${stat}-${id}" class="input-field w-full" min="0" max="150" value="0" oninput="validateIntegerInput(this)"></div>`).join('');
        };

        return `
            <div id="card-slot-${cardId}" class="card-bg rounded-lg p-6 border border-gray-600">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">카드 ${cardId}</h3>
                    <button onclick="domManager.resetCard(${cardId})" class="btn-secondary text-sm px-3 py-1">초기화</button>
                </div>
                
                <!-- Player Info Input -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3">선수 정보</h4>
                    <div class="grid grid-cols-3 gap-3">
                        <div><label class="block text-sm text-secondary mb-1">선수명</label><input type="text" id="player-name-${cardId}" class="input-field w-full" placeholder="예: 이정후"></div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">팀</label>
                            <button onclick="domManager.openTeamModalForCard(${cardId})" class="input-field w-full text-left h-[42px]">
                                <span id="team-display-${cardId}">팀 선택</span>
                            </button>
                            <input type="hidden" id="team-${cardId}" value="">
                        </div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">연도</label>
                            <button onclick="domManager.openYearModalForCard(${cardId})" class="input-field w-full text-left h-[42px]">
                                <span id="year-display-${cardId}">연도 선택</span>
                            </button>
                            <input type="hidden" id="year-${cardId}" value="">
                        </div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">종류</label>
                            <button onclick="domManager.openGradeModalForCard(${cardId})" class="input-field w-full text-left h-[42px]">
                                <span id="grade-display-${cardId}">종류 선택</span>
                            </button>
                            <input type="hidden" id="grade-${cardId}" value="">
                        </div>
                        <div id="star-rating-container-${cardId}"><label class="block text-sm text-secondary mb-1">등급</label><select id="star-rating-${cardId}" class="input-field w-full"></select></div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">포지션</label>
                            <button onclick="domManager.openPositionModalForCard(${cardId})" class="input-field w-full text-left h-[42px]">
                                <span id="position-display-${cardId}">포지션 선택</span>
                            </button>
                            <input type="hidden" id="position-${cardId}" value="">
                        </div>
                    </div>
                </div>

                <!-- Base Stats Input -->
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3">기본 능력치</h4>
                    <div id="batter-stats-${cardId}" class="grid grid-cols-2 gap-3">` + generateStatInputs(cardId, ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'], ['파워', '정확', '선구', '주루', '인내', '수비']) + `</div>
                    <div id="pitcher-stats-${cardId}" class="grid grid-cols-2 gap-3 hidden">` + generateStatInputs(cardId, ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'], ['구속', '제구', '구위', '변화', '지구력', '수비']) + `</div>
                </div>

                <!-- Growth Factors -->
                <fieldset id="growth-factors-${cardId}" disabled>
                    <div class="mb-6">
                        <h4 class="text-lg font-medium mb-3">성장 요소</h4>

                        <!-- Enhancement Level -->
                        <div class="mb-4">
                            <label class="block text-sm text-secondary mb-2">강화 레벨</label>
                            <div class="grid grid-cols-6 gap-2">` + [0,1,2,3,4,5,6,7,8,9,10].map(l => `<button type="button" class="enhancement-btn" data-level="${l}" onclick="setEnhancementLevel(${cardId}, ${l})">+${l}</button>`).join('') + `</div>
                            <input type="hidden" id="enhancement-level-${cardId}" value="0">
                        </div>

                        <!-- Training Points -->
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-sm text-secondary">훈련 포인트 분배</label>
                                <div id="training-points-info-${cardId}" class="text-sm text-secondary">
                                    <span>최대: <span id="max-points-${cardId}">0</span></span> / 
                                    <span>남은: <span id="remaining-points-${cardId}">0</span></span>
                                </div>
                            </div>
                            <div id="training-batter-${cardId}" class="grid grid-cols-2 gap-3">` + generateStatInputs(cardId, ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'], ['파워', '정확', '선구', '주루', '인내', '수비'], 'training-') + `</div>
                            <div id="training-pitcher-${cardId}" class="grid grid-cols-2 gap-3 hidden">` + generateStatInputs(cardId, ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'], ['구속', '제구', '구위', '변화', '지구력', '수비'], 'training-') + `</div>
                        </div>
                    </div>
                </fieldset>

                <!-- Final Stats Display -->
                <div class="border-t border-gray-600 pt-4">
                    <h4 class="text-lg font-medium mb-3 accent-gold">최종 능력치</h4>
                    <div id="final-stats-${cardId}" class="grid grid-cols-2 gap-3">
                        <!-- Final stats will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        `;
    }

    // 능력치 입력 필드 HTML 생성 헬퍼
    generateStatInputs(cardId, stats, labels, prefix = '') {
        return stats.map((stat, i) => `<div><label class="block text-sm text-secondary mb-1">${labels[i]}</label><input type="number" id="${prefix}${stat}-${cardId}" class="input-field w-full" min="0" max="150" value="0" oninput="validateIntegerInput(this)"></div>`).join('');
    }

    // 카드 추가 버튼 업데이트
    updateAddCardButton() {
        const addCardBtn = document.getElementById('add-card-btn');
        if (this.currentCardCount >= this.maxCards) {
            addCardBtn.textContent = `최대 ${this.maxCards}장`;
            addCardBtn.disabled = true;
        } else {
            addCardBtn.textContent = `+ 카드 추가 (${this.currentCardCount}/${this.maxCards})`;
            addCardBtn.disabled = false;
        }
    }

    // 비교 섹션 업데이트
    updateComparisonSection() {
        const activeCards = cardCalculator.getActiveCards();
        const comparisonSection = document.getElementById('comparison-section');
        if (activeCards.length >= 2) {
            comparisonSection.classList.remove('hidden');
            this.updateComparisonTable();
            chartManager.updateChart(activeCards); // ChartManager 사용
        } else {
            comparisonSection.classList.add('hidden');
        }
    }

    // 비교 테이블 업데이트
    updateComparisonTable() {
        const activeCards = cardCalculator.getActiveCards();
        const tableBody = document.getElementById('comparison-table-body');
        let html = '';
        // Determine if any active card is a pitcher to adjust table headers
                const hasPitcher = activeCards.some(card => ['SP', 'RP', 'CP'].includes(card.playerInfo.position));

        let statHeaders = ['파워', '정확', '선구', '주루', '인내', '수비'];
        if (hasPitcher) {
            statHeaders = ['구속', '제구', '구위', '변화', '지구력', '수비'];
        }

        // Update table headers
        const tableHeadRow = document.getElementById('comparison-table-head-row');
        if (tableHeadRow) {
            tableHeadRow.innerHTML = `<th class="py-3 px-4">카드</th>` +
                                     statHeaders.map(header => `<th class="py-3 px-4">${header}</th>`).join('') +
                                     `<th class="py-3 px-4">OVR</th>`; // OVR 헤더 추가
        }


        activeCards.forEach(card => {
            const isPitcher = ['SP', 'RP', 'CP'].includes(card.playerInfo.position);
            const stats = isPitcher ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
            html += `<tr class="border-b border-gray-600"><td class="py-3 px-4 font-semibold">${card.playerInfo.name}</td>`;
            stats.forEach(stat => {
                const value = card.finalStats[stat] || 0;
                html += `<td class="py-3 px-4">${value}</td>`;
            });
            html += `<td class="py-3 px-4">${card.finalStats.ovr ? card.finalStats.ovr.toFixed(1) : 'N/A'}</td>`; // OVR 값 추가
            html += `</tr>`;
        });
        tableBody.innerHTML = html;
    }

    // 카드 리셋
    resetCard(cardId) {
        const cardSlot = document.getElementById(`card-slot-${cardId}`);
        
        // Reset text and number inputs
        const inputs = cardSlot.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => {
            input.value = input.id.includes('training') ? '0' : '';
        });

        // Reset select dropdowns
        const selects = cardSlot.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Reset team and year buttons/hidden inputs
        document.getElementById(`team-display-${cardId}`).textContent = '팀 선택';
        document.getElementById(`team-${cardId}`).value = '';
        document.getElementById(`year-display-${cardId}`).textContent = '연도 선택';
        document.getElementById(`year-${cardId}`).value = '';
        document.getElementById(`grade-display-${cardId}`).textContent = '종류 선택';
        document.getElementById(`grade-${cardId}`).value = '';
        document.getElementById(`position-display-${cardId}`).textContent = '포지션 선택';
        document.getElementById(`position-${cardId}`).value = '';

        // Reset enhancement level
        document.getElementById(`enhancement-level-${cardId}`).value = '0';
        const enhancementButtons = cardSlot.querySelectorAll('.enhancement-btn');
        enhancementButtons.forEach(btn => btn.classList.remove('active'));
        cardSlot.querySelector(`.enhancement-btn[data-level="0"]`).classList.add('active');

        // Trigger updates
        this.handleGradeChange(cardId);
        this.updateCardData(cardId);
    }

    // 모달 열기
    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    // 모달 닫기
    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // 전역 세트덱 상태 반환
    getGlobalSetDeckState() {
        return {
            selectedTeam: this.selectedTeam,
            selectedYear: this.selectedYear,
            setDeckScore: this.setDeckScore, // 이 값은 현재 DOMManager에서 계산되지 않음.
            selectedTierOptions: this.selectedTierOptions
        };
    }

    populateGradeButtons() {
        const container = document.getElementById('grade-buttons-container');
        container.innerHTML = '';
        GRADES.forEach(grade => {
            const button = document.createElement('button');
            button.textContent = grade;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const targetCardId = this.activeModalTargetCardId;
                if (targetCardId !== null) {
                    document.getElementById(`grade-display-${targetCardId}`).textContent = grade;
                    document.getElementById(`grade-${targetCardId}`).value = grade;
                    this.handleGradeChange(targetCardId);
                }
                this.closeModal('grade-selection-modal');
            });
            container.appendChild(button);
        });
    }

    populatePositionButtons() {
        const container = document.getElementById('position-buttons-container');
        container.innerHTML = '';
        Object.entries(POSITIONS).forEach(([value, label]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const targetCardId = this.activeModalTargetCardId;
                if (targetCardId !== null) {
                    document.getElementById(`position-display-${targetCardId}`).textContent = label;
                    document.getElementById(`position-${targetCardId}`).value = value;
                    this.updateCardData(targetCardId);
                }
                this.closeModal('position-selection-modal');
            });
            container.appendChild(button);
        });
    }

    // 팀 버튼 채우기 (모달용)
    populateTeamButtons() {
        const container = document.getElementById('team-buttons-container');
        container.innerHTML = '';
        TEAMS.forEach(team => {
            const button = document.createElement('button');
            button.textContent = team;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const targetCardId = this.activeModalTargetCardId;
                if (targetCardId !== null) {
                    // 개별 카드 업데이트
                    document.getElementById(`team-display-${targetCardId}`).textContent = team;
                    document.getElementById(`team-${targetCardId}`).value = team;
                    this.updateCardData(targetCardId);
                } else {
                    // 전역 세트덱 업데이트
                    this.selectedTeam = team;
                    document.getElementById('selected-team-display').textContent = team;
                    this.updateAllCards();
                }
                this.closeModal('team-selection-modal');
            });
            container.appendChild(button);
        });
    }

    // 연도 버튼 채우기 (모달용)
    populateYearButtons() {
        const container = document.getElementById('year-buttons-container');
        container.innerHTML = '';
        YEARS.forEach(year => {
            const button = document.createElement('button');
            button.textContent = year;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const targetCardId = this.activeModalTargetCardId;
                if (targetCardId !== null) {
                    // 개별 카드 업데이트
                    document.getElementById(`year-display-${targetCardId}`).textContent = year;
                    document.getElementById(`year-${targetCardId}`).value = year;
                    this.updateCardData(targetCardId);
                } else {
                    // 전역 세트덱 업데이트
                    this.selectedYear = year;
                    document.getElementById('selected-year-display').textContent = year;
                    this.updateAllCards();
                }
                this.closeModal('year-selection-modal');
            });
            container.appendChild(button);
        });
    }

    // 모든 카드 데이터 업데이트 (전역 세트덱 변경 시)
    updateAllCards() {
        cardCalculator.cards.forEach(card => {
            this.updateCardData(card.id);
        });
    }

    // 전역 세트덱 UI 업데이트 (초기 로드 시)
    updateGlobalSetDeckUI() {
        // 이 부분은 SET_DECK_TIERS를 기반으로 동적으로 UI를 생성해야 합니다.
        // 현재는 SET_DECK_TIERS를 활용하는 로직이 없으므로, 추후 구현이 필요합니다.
        // app_specification.md의 "세트덱 스코어 반영" 기능을 구현하려면 이 부분이 중요합니다.
    }
}

// 전역 인스턴스 생성
const domManager = new DOMManager();

// 글로벌 헬퍼 함수 (HTML에서 직접 호출)
function setEnhancementLevel(cardId, level) {
    const buttons = document.querySelectorAll(`#card-slot-${cardId} .enhancement-btn`);
    buttons.forEach(btn => btn.classList.remove('active'));
    const selectedBtn = document.querySelector(`#card-slot-${cardId} .enhancement-btn[data-level="${level}"]`);
    if (selectedBtn) selectedBtn.classList.add('active');
    document.getElementById(`enhancement-level-${cardId}`).value = level;
    domManager.updateCardData(cardId);
}

function validateIntegerInput(input) {
    let value = input.value;
    
    // 빈 값이면 0으로 설정
    if (value === '' || value === null || value === undefined) {
        input.value = '0';
        return;
    }
    
    // 정수로 변환
    let intValue = parseInt(value);
    
    // NaN이거나 음수면 0으로 설정
    if (isNaN(intValue) || intValue < 0) {
        input.value = '0';
        return;
    }
    
    // 최대값 체크
    const maxValue = parseInt(input.getAttribute('max'));
    if (intValue > maxValue) {
        input.value = maxValue.toString();
        return;
    }
    
    // 앞자리 0 제거 (예: "01" -> "1")
    if (value !== intValue.toString()) {
        input.value = intValue.toString();
    }
}

function addCard() {
    domManager.addCard();
}

function resetCard(cardId) {
    domManager.resetCard(cardId);
}

// 모달 닫기 헬퍼 (HTML에서 직접 호출)
function closeTeamModal() {
    domManager.closeModal('team-selection-modal');
}

function closeYearModal() {
    domManager.closeModal('year-selection-modal');
}
