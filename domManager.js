// 컴투스프로야구V25 카드 성장 시뮬레이터 - DOM 관리
// UI 요소 생성, 업데이트, 이벤트 처리를 담당하는 모듈

const GRADES = ['라이브', '라이브 올스타', '시즌', '임팩트', '시그니처', '골든글러브', '국가대표'];
const POSITIONS = {
    '1B': '1루수',
    '2B': '2루수',
    '3B': '3루수',
    'SS': '유격수',
    'LF': '좌익수',
    'CF': '중견수',
    'RF': '우익수',
    'C': '포수',
    'DH': '지명타자',
    'SP': '선발투수',
    'RP': '중계투수',
    'CP': '마무리투수'
};

class DOMManager {
    constructor() {
        this.currentCardCount = 0;
        this.maxCards = MAX_CARDS;
        this.globalSetDeckScore = 0;
        this.selectedSetDeckOptions = {}; // { score: { optionKey, team, year } }
        this.activeModalTargetCardId = null;
        this.activeSetDeckSelection = { score: null, optionKey: null };
    }

    init() {
        this.populateTeamButtons();
        this.populateYearButtons();
        this.populateGradeButtons();
        this.populatePositionButtons();
        this.populateSetDeckScoreOptions();
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    openTeamModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
        this.openModal('team-selection-modal');
    }

    openYearModalForCard(cardId) {
        this.activeModalTargetCardId = cardId;
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

    setupCardEventListeners(cardId) {
        const gradeSelect = document.getElementById(`grade-${cardId}`);
        if (gradeSelect) {
            gradeSelect.addEventListener('change', () => this.handleGradeChange(cardId));
        }

        const starSelect = document.getElementById(`star-rating-${cardId}`);
        if (starSelect) {
            starSelect.addEventListener('change', () => this.updateCardData(cardId));
        }

        const playerInfoInputs = document.querySelectorAll(`#player-name-${cardId}, #team-${cardId}, #year-${cardId}`);
        playerInfoInputs.forEach(input => {
            input.addEventListener('input', () => this.updateCardData(cardId));
        });

        const baseStatInputs = document.querySelectorAll(`#batter-stats-${cardId} input, #pitcher-stats-${cardId} input`);
        baseStatInputs.forEach(input => {
            input.addEventListener('input', () => this.updateCardData(cardId));
        });

        const trainingInputs = document.querySelectorAll(`#training-batter-${cardId} input, #training-pitcher-${cardId} input`);
        trainingInputs.forEach(input => {
            input.addEventListener('input', () => this.updateTrainingPointsInfo(cardId, input));
        });
    }

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
                option.text = `${star}성`;
                starSelect.add(option);
            });

            if (availableStars.length === 1) {
                starSelect.value = availableStars[0];
            } else if (availableStars.length > 1) {
                const placeholder = document.createElement('option');
                placeholder.value = "";
                placeholder.text = "등급 선택";
                placeholder.disabled = true;
                placeholder.selected = true;
                starSelect.prepend(placeholder);
            }
            starSelect.disabled = false;
        } else {
            const placeholder = document.createElement('option');
            placeholder.value = "";
            placeholder.text = "종류 필요";
            starSelect.add(placeholder);
            starSelect.disabled = true;
        }
        this.updateCardData(cardId);
    }

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
        this.updateCardData(cardId);
    }

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

    updateGrowthFactorsAvailability(cardId) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const star = document.getElementById(`star-rating-${cardId}`).value;
        const growthFactorsFieldset = document.getElementById(`growth-factors-${cardId}`);

        growthFactorsFieldset.disabled = !(grade && star);
    }

    collectCardData(cardId) {
        const grade = document.getElementById(`grade-${cardId}`).value;
        const star = document.getElementById(`star-rating-${cardId}`).value;
        
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

    updateFinalStatsDisplay(cardId) {
        const cardData = cardCalculator.cards.find(card => card.id === cardId);
        if (!cardData || !cardData.finalStats) return;

        const finalStatsContainer = document.getElementById(`final-stats-${cardId}`);
        if (!finalStatsContainer) return;

        const isPitcher = ['SP', 'RP', 'CP'].includes(cardData.playerInfo.position);
        const stats = isPitcher ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
        const statLabels = isPitcher ? ['구속', '제구', '구위', '변화', '지구력', '수비'] : ['파워', '정확', '선구', '주루', '인내', '수비'];

        let html = '';
        stats.forEach((stat, index) => {
            const value = cardData.finalStats[stat] || 0;
            html += `<div class="text-center"><div class="text-sm text-secondary">${statLabels[index]}</div><div class="text-lg font-semibold accent-blue">${value.toFixed(1)}</div></div>`;
        });
        finalStatsContainer.innerHTML = html;
    }

    clearFinalStatsDisplay(cardId) {
        const finalStatsContainer = document.getElementById(`final-stats-${cardId}`);
        if (finalStatsContainer) {
            finalStatsContainer.innerHTML = '';
        }
    }

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
        const generateStatInputs = (id, stats, labels, prefix = '') => {
            return stats.map((stat, i) => `<div><label class="block text-sm text-secondary mb-1">${labels[i]}</label><input type="number" id="${prefix}${stat}-${id}" class="input-field w-full" min="0" max="150" value="0" oninput="validateIntegerInput(this)"></div>`).join('');
        };

        return `
            <div id="card-slot-${cardId}" class="card-bg rounded-lg p-6 border border-gray-600">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">카드 ${cardId}</h3>
                    <button onclick="domManager.resetCard(${cardId})" class="btn-secondary text-sm px-3 py-1">초기화</button>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3">선수 정보</h4>
                    <div class="grid grid-cols-3 gap-3">
                        <div><label class="block text-sm text-secondary mb-1">선수명</label><input type="text" id="player-name-${cardId}" class="input-field w-full" placeholder="예: 이정후"></div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">팀</label>
                            <button onclick="domManager.openTeamModalForCard(${cardId})" class="input-field w-full text-left h-[42px]"><span id="team-display-${cardId}">팀 선택</span></button>
                            <input type="hidden" id="team-${cardId}" value="">
                        </div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">연도</label>
                            <button onclick="domManager.openYearModalForCard(${cardId})" class="input-field w-full text-left h-[42px]"><span id="year-display-${cardId}">연도 선택</span></button>
                            <input type="hidden" id="year-${cardId}" value="">
                        </div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">종류</label>
                            <button onclick="domManager.openGradeModalForCard(${cardId})" class="input-field w-full text-left h-[42px]"><span id="grade-display-${cardId}">종류 선택</span></button>
                            <input type="hidden" id="grade-${cardId}" value="">
                        </div>
                        <div id="star-rating-container-${cardId}"><label class="block text-sm text-secondary mb-1">등급</label><select id="star-rating-${cardId}" class="input-field w-full"></select></div>
                        <div>
                            <label class="block text-sm text-secondary mb-1">포지션</label>
                            <button onclick="domManager.openPositionModalForCard(${cardId})" class="input-field w-full text-left h-[42px]"><span id="position-display-${cardId}">포지션 선택</span></button>
                            <input type="hidden" id="position-${cardId}" value="">
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3">기본 능력치</h4>
                    <div id="batter-stats-${cardId}" class="grid grid-cols-2 gap-3">` + generateStatInputs(cardId, ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'], ['파워', '정확', '선구', '주루', '인내', '수비']) + `</div>
                    <div id="pitcher-stats-${cardId}" class="grid grid-cols-2 gap-3 hidden">` + generateStatInputs(cardId, ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'], ['구속', '제구', '구위', '변화', '지구력', '수비']) + `</div>
                </div>

                <fieldset id="growth-factors-${cardId}" disabled>
                    <div class="mb-6">
                        <h4 class="text-lg font-medium mb-3">성장 요소</h4>
                        <div class="mb-4">
                            <label class="block text-sm text-secondary mb-2">강화 레벨</label>
                            <div class="grid grid-cols-6 gap-2">` + [0,1,2,3,4,5,6,7,8,9,10].map(l => `<button type="button" class="enhancement-btn" data-level="${l}" onclick="setEnhancementLevel(${cardId}, ${l})">+${l}</button>`).join('') + `</div>
                            <input type="hidden" id="enhancement-level-${cardId}" value="0">
                        </div>
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

                <div class="border-t border-gray-600 pt-4">
                    <h4 class="text-lg font-medium mb-3 accent-gold">최종 능력치</h4>
                    <div id="final-stats-${cardId}" class="grid grid-cols-3 gap-3"></div>
                </div>
            </div>
        `;
    }

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

    updateComparisonSection() {
        const activeCards = cardCalculator.getActiveCards();
        const comparisonSection = document.getElementById('comparison-section');
        if (activeCards.length >= 2) {
            comparisonSection.classList.remove('hidden');
            this.updateComparisonTable();
            chartManager.updateChart(activeCards);
        } else {
            comparisonSection.classList.add('hidden');
        }
    }

    updateComparisonTable() {
        const activeCards = cardCalculator.getActiveCards();
        const tableBody = document.getElementById('comparison-table-body');
        let html = '';
        const hasPitcher = activeCards.some(card => ['SP', 'RP', 'CP'].includes(card.playerInfo.position));
        let statHeaders = hasPitcher ? ['구속', '제구', '구위', '변화', '지구력', '수비'] : ['파워', '정확', '선구', '주루', '인내', '수비'];
        
        const tableHeadRow = document.getElementById('comparison-table-head-row');
        if (tableHeadRow) {
            tableHeadRow.innerHTML = `<th class="py-3 px-4">카드</th>` +
                                     statHeaders.map(header => `<th class="py-3 px-4">${header}</th>`).join('') +
                                     `<th class="py-3 px-4">OVR</th>`;
        }

        activeCards.forEach(card => {
            const isPitcher = ['SP', 'RP', 'CP'].includes(card.playerInfo.position);
            const stats = isPitcher ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
            html += `<tr class="border-b border-gray-600"><td class="py-3 px-4 font-semibold">${card.playerInfo.name || `카드 ${card.id}`}</td>`;
            stats.forEach(stat => {
                const value = card.finalStats[stat] || 0;
                html += `<td class="py-3 px-4">${value.toFixed(1)}</td>`;
            });
            html += `<td class="py-3 px-4">${card.finalStats.ovr ? card.finalStats.ovr.toFixed(1) : 'N/A'}</td>`;
            html += `</tr>`;
        });
        tableBody.innerHTML = html;
    }

    resetCard(cardId) {
        const cardSlot = document.getElementById(`card-slot-${cardId}`);
        const inputs = cardSlot.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => {
            if (input.id.startsWith('training-')) {
                input.value = '0';
            } else {
                input.value = '';
            }
        });

        const selects = cardSlot.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        document.getElementById(`team-display-${cardId}`).textContent = '팀 선택';
        document.getElementById(`team-${cardId}`).value = '';
        document.getElementById(`year-display-${cardId}`).textContent = '연도 선택';
        document.getElementById(`year-${cardId}`).value = '';
        document.getElementById(`grade-display-${cardId}`).textContent = '종류 선택';
        document.getElementById(`grade-${cardId}`).value = '';
        document.getElementById(`position-display-${cardId}`).textContent = '포지션 선택';
        document.getElementById(`position-${cardId}`).value = '';

        document.getElementById(`enhancement-level-${cardId}`).value = '0';
        const enhancementButtons = cardSlot.querySelectorAll('.enhancement-btn');
        enhancementButtons.forEach(btn => btn.classList.remove('active'));
        cardSlot.querySelector(`.enhancement-btn[data-level="0"]`).classList.add('active');

        this.handleGradeChange(cardId);
        this.updateCardData(cardId);
    }

    getSetDeckState() {
        return {
            globalSetDeckScore: this.globalSetDeckScore,
            selectedSetDeckOptions: this.selectedSetDeckOptions
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
                    this.togglePositionStats(targetCardId);
                }
                this.closeModal('position-selection-modal');
            });
            container.appendChild(button);
        });
    }

    updateSetDeckScore() {
        const scoreInput = document.getElementById('set-deck-score-input');
        this.globalSetDeckScore = parseInt(scoreInput.value) || 0;
        document.getElementById('selected-set-deck-score-display').textContent = this.globalSetDeckScore;
        this.populateSetDeckScoreOptions();
        this.updateAllCards();
        this.closeModal('set-deck-score-modal');
    }

    populateSetDeckScoreOptions() {
        const container = document.getElementById('setdeck-score-options-container');
        container.innerHTML = '';
        const sortedScores = Object.keys(SET_DECK_TIERS).map(Number).sort((a, b) => a - b);

        sortedScores.forEach(score => {
            if (score > this.globalSetDeckScore) return;

            const tierData = SET_DECK_TIERS[score];
            const tierDiv = document.createElement('div');
            tierDiv.classList.add('mb-4', 'p-3', 'border', 'border-gray-700', 'rounded-md');

            const scoreHeader = document.createElement('h4');
            scoreHeader.classList.add('text-lg', 'font-medium', 'mb-2');
            scoreHeader.textContent = `세트덱 스코어 ${score}`;
            tierDiv.appendChild(scoreHeader);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('flex', 'space-x-2');

            const selection = this.selectedSetDeckOptions[score];

            ['optionA', 'optionB'].forEach(optionKey => {
                const option = tierData[optionKey];
                if (option) {
                    const button = document.createElement('button');
                    let label = option.label;
                    if (selection && selection.optionKey === optionKey) {
                        if (selection.team) label += ` (${selection.team})`;
                        if (selection.year) label += ` (${selection.year})`;
                    }
                    button.textContent = label;
                    button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1', 'flex-1');
                    
                    if (selection && selection.optionKey === optionKey) {
                        button.classList.add('active');
                    }

                    button.addEventListener('click', () => {
                        this.handleSetDeckButtonClick(score, optionKey);
                    });
                    optionsDiv.appendChild(button);
                }
            });

            tierDiv.appendChild(optionsDiv);
            container.appendChild(tierDiv);
        });
    }

    handleSetDeckButtonClick(score, optionKey) {
        const option = SET_DECK_TIERS[score][optionKey];
        const needsTeamSelection = ['team', 'team_and_grade', 'team_and_position'].includes(option.type);
        const needsYearSelection = ['year', 'year_and_position'].includes(option.type);

        this.activeSetDeckSelection = { score, optionKey };

        if (needsTeamSelection) {
            this.openModal('team-selection-modal');
        } else if (needsYearSelection) {
            this.openModal('year-selection-modal');
        } else {
            this.handleSetDeckOptionSelection(score, optionKey);
        }
    }

    handleSetDeckOptionSelection(score, optionKey, extraData = {}) {
        const currentSelection = this.selectedSetDeckOptions[score];

        // If the user is clicking the currently active option key
        if (currentSelection && currentSelection.optionKey === optionKey) {
            // If no new data is coming from a modal, it's a toggle OFF action.
            if (Object.keys(extraData).length === 0) {
                delete this.selectedSetDeckOptions[score];
            } else {
                // If new data IS coming from a modal, it's an UPDATE action.
                this.selectedSetDeckOptions[score] = { optionKey, ...extraData };
            }
        } else {
            // If it's a new option for this score level, it's a SET action.
            this.selectedSetDeckOptions[score] = { optionKey, ...extraData };
        }
        
        this.populateSetDeckScoreOptions();
        this.updateAllCards();
    }

    populateTeamButtons() {
        const container = document.getElementById('team-buttons-container');
        container.innerHTML = '';
        TEAMS.forEach(team => {
            const button = document.createElement('button');
            button.textContent = team;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const cardId = this.activeModalTargetCardId;
                if (cardId !== null) {
                    document.getElementById(`team-display-${cardId}`).textContent = team;
                    document.getElementById(`team-${cardId}`).value = team;
                    this.updateCardData(cardId);
                    this.activeModalTargetCardId = null; // FIX: Reset state
                } else if (this.activeSetDeckSelection.score !== null) {
                    const { score, optionKey } = this.activeSetDeckSelection;
                    this.handleSetDeckOptionSelection(score, optionKey, { team: team });
                    this.activeSetDeckSelection = { score: null, optionKey: null };
                }
                this.closeModal('team-selection-modal');
            });
            container.appendChild(button);
        });
    }

    populateYearButtons() {
        const container = document.getElementById('year-buttons-container');
        container.innerHTML = '';
        YEARS.forEach(year => {
            const button = document.createElement('button');
            button.textContent = year;
            button.classList.add('btn-secondary', 'text-sm', 'px-3', 'py-1');
            button.addEventListener('click', () => {
                const cardId = this.activeModalTargetCardId;
                if (cardId !== null) {
                    document.getElementById(`year-display-${cardId}`).textContent = year;
                    document.getElementById(`year-${cardId}`).value = year;
                    this.updateCardData(cardId);
                    this.activeModalTargetCardId = null; // FIX: Reset state
                } else if (this.activeSetDeckSelection.score !== null) {
                    const { score, optionKey } = this.activeSetDeckSelection;
                    this.handleSetDeckOptionSelection(score, optionKey, { year: year });
                    this.activeSetDeckSelection = { score: null, optionKey: null };
                }
                this.closeModal('year-selection-modal');
            });
            container.appendChild(button);
        });
    }

    updateAllCards() {
        for (let i = 1; i <= this.currentCardCount; i++) {
            this.updateCardData(i);
        }
    }
}

const domManager = new DOMManager();

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
    if (value === '' || value === null || value === undefined) {
        input.value = '0';
        return;
    }
    let intValue = parseInt(value);
    if (isNaN(intValue) || intValue < 0) {
        input.value = '0';
        return;
    }
    const maxValue = parseInt(input.getAttribute('max'));
    if (intValue > maxValue) {
        input.value = maxValue.toString();
        return;
    }
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

function closeTeamModal() {
    domManager.closeModal('team-selection-modal');
}

function closeYearModal() {
    domManager.closeModal('year-selection-modal');
}