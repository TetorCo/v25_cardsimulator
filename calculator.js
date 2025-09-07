// 컴투스프로야구V25 카드 성장 시뮬레이터 - 계산 로직
// 모든 능력치 계산 및 추천 알고리즘을 담당하는 모듈

class CardCalculator {
    constructor() {
        this.cards = [];
    }

    // 카드 데이터 업데이트
    updateCard(cardData) {
        const existingIndex = this.cards.findIndex(card => card.id === cardData.id);
        
        if (existingIndex >= 0) {
            this.cards[existingIndex] = cardData;
        } else {
            this.cards.push(cardData);
        }
        
        this.calculateFinalStats(cardData);
    }

    // 최종 능력치 계산
    calculateFinalStats(cardData) {
        const isPitcher = cardData.playerInfo.position === 'P';
        const stats = isPitcher ? 
            ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : 
            ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];

        const finalStats = {};
        
        stats.forEach((stat, index) => {
            const baseStat = cardData.baseStats[stat] || 0;
            const enhancementBonus = this.getEnhancementBonus(cardData, index);
            const trainingIncrease = cardData.growthFactors.trainingDistribution[stat] || 0;
            // setDeckBonus는 domManager에서 전역 세트덱 상태를 가져와 계산해야 합니다.
            // 현재는 domManager가 없으므로 0으로 처리하거나, 임시로 빈 객체를 전달합니다.
            // 실제 구현 시 domManager.getGlobalSetDeckState()를 사용해야 합니다.
            const setDeckBonus = this.calculateSetDeckBonus(cardData, {}, stat); // 임시로 빈 객체 전달
            
            finalStats[stat] = baseStat + enhancementBonus + trainingIncrease + setDeckBonus;
        });

        // OVR 계산 (app_specification.md에 따라 구현 필요)
        // 임시로 OVR을 모든 스탯의 평균으로 설정
        const totalStats = Object.values(finalStats).reduce((sum, val) => sum + val, 0);
        finalStats.ovr = totalStats / stats.length;


        cardData.finalStats = finalStats;
        
        // 카드 데이터 업데이트
        const cardIndex = this.cards.findIndex(card => card.id === cardData.id);
        if (cardIndex >= 0) {
            this.cards[cardIndex] = cardData;
        }
    }

    // 등급별 강화 보너스 계산
    getEnhancementBonus(cardData, statIndex) {
        const grade = cardData.playerInfo.grade;
        const enhancementLevel = cardData.growthFactors.enhancementLevel;
        
        if (ENHANCEMENT_BONUSES_BY_GRADE[grade] && ENHANCEMENT_BONUSES_BY_GRADE[grade][enhancementLevel]) {
            return ENHANCEMENT_BONUSES_BY_GRADE[grade][enhancementLevel][statIndex] || 0;
        }
        
        return 0;
    }

    // 세트덱 보너스 계산 (전역 세트덱 설정 기반)
    calculateSetDeckBonus(cardData, globalSetDeckState, stat) {
        let bonus = 0;
        const playerGrade = cardData.playerInfo.grade;
        const playerTeam = cardData.playerInfo.team;
        const playerYear = cardData.playerInfo.year;
        const playerPosition = cardData.playerInfo.position; // 'P' or batter position

        // globalSetDeckState가 유효한지 확인
        if (!globalSetDeckState || !globalSetDeckState.selectedTierOptions) {
            return 0;
        }

        // Iterate through selected tier options
        for (const score in globalSetDeckState.selectedTierOptions) {
            const selectedOptionKey = globalSetDeckState.selectedTierOptions[score]; // 'optionA' or 'optionB'
            const tierData = SET_DECK_TIERS[score];

            if (!tierData) continue; // Should not happen if selectedTierOptions is valid

            const selectedOption = tierData[selectedOptionKey];

            if (selectedOption && selectedOption.bonus) {
                let applyBonus = false;

                switch (selectedOption.type) {
                    case 'team':
                        if (globalSetDeckState.selectedTeam === playerTeam) {
                            applyBonus = true;
                        }
                        break;
                    case 'grade':
                        if (selectedOption.condition.includes(playerGrade)) {
                            applyBonus = true;
                        }
                        break;
                    case 'position':
                        if (selectedOption.condition === 'batter' && playerPosition !== 'P') {
                            applyBonus = true;
                        } else if (selectedOption.condition === 'pitcher' && playerPosition === 'P') {
                            applyBonus = true;
                        }
                        break;
                    case 'year':
                        if (globalSetDeckState.selectedYear === playerYear) {
                            applyBonus = true;
                        }
                        break;
                    case 'year_and_position':
                        if (globalSetDeckState.selectedYear === playerYear) {
                            if (selectedOption.condition.position === 'batter' && playerPosition !== 'P') {
                                applyBonus = true;
                            } else if (selectedOption.condition.position === 'pitcher' && playerPosition === 'P') {
                                applyBonus = true;
                            }
                        }
                        break;
                }

                if (applyBonus) {
                    if (selectedOption.bonus.all) {
                        bonus += selectedOption.bonus.all;
                    } else if (selectedOption.bonus[stat]) {
                        bonus += selectedOption.bonus[stat];
                    } else if (selectedOption.bonus.speed && stat === 'speed') { // For specific stats like speed/fielding
                        bonus += selectedOption.bonus.speed;
                    } else if (selectedOption.bonus.fielding && stat === 'fielding') {
                        bonus += selectedOption.bonus.fielding;
                    } else if (selectedOption.bonus.breaking && stat === 'breaking') {
                        bonus += selectedOption.bonus.breaking;
                    } else if (selectedOption.bonus.stamina && stat === 'stamina') {
                        bonus += selectedOption.bonus.stamina;
                    }
                }
            }
        }
        return bonus;
    }

    // 활성화된 카드들만 반환
    getActiveCards() {
        return this.cards.filter(card => card.isActive);
    }

    // 카드 제거
    removeCard(cardId) {
        this.cards = this.cards.filter(card => card.id !== cardId);
    }

    // 모든 카드 초기화
    resetAllCards() {
        this.cards = [];
    }
}

// 전역 계산기 인스턴스
const cardCalculator = new CardCalculator();
