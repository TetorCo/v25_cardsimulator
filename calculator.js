// 컴투스프로야구V25 카드 성장 시뮬레이터 - 계산 로직
// 모든 능력치 계산 및 추천 알고리즘을 담당하는 모듈

class CardCalculator {
    constructor() {
        this.cards = [];
    }

    updateCard(cardData) {
        const existingIndex = this.cards.findIndex(card => card.id === cardData.id);
        
        if (existingIndex >= 0) {
            this.cards[existingIndex] = cardData;
        } else {
            this.cards.push(cardData);
        }
        
        this.calculateFinalStats(cardData);
    }

    calculateFinalStats(cardData) {
        const isPitcher = ['SP', 'RP', 'CP'].includes(cardData.playerInfo.position);
        const stats = isPitcher ? 
            ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : 
            ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];

        const finalStats = {};
        const setDeckState = domManager.getSetDeckState();
        
        stats.forEach((stat, index) => {
            const baseStat = cardData.baseStats[stat] || 0;
            const enhancementBonus = this.getEnhancementBonus(cardData, index);
            const trainingIncrease = cardData.growthFactors.trainingDistribution[stat] || 0;
            const setDeckBonus = this.calculateSetDeckBonus(cardData, setDeckState, stat);
            
            finalStats[stat] = baseStat + enhancementBonus + trainingIncrease + setDeckBonus;
        });

        const totalStats = Object.values(finalStats).reduce((sum, val) => sum + val, 0);
        finalStats.ovr = totalStats / stats.length;

        cardData.finalStats = finalStats;
        
        const cardIndex = this.cards.findIndex(card => card.id === cardData.id);
        if (cardIndex >= 0) {
            this.cards[cardIndex] = cardData;
        }
    }

    getEnhancementBonus(cardData, statIndex) {
        const grade = cardData.playerInfo.grade;
        const enhancementLevel = cardData.growthFactors.enhancementLevel;
        
        if (ENHANCEMENT_BONUSES_BY_GRADE[grade] && ENHANCEMENT_BONUSES_BY_GRADE[grade][enhancementLevel]) {
            return ENHANCEMENT_BONUSES_BY_GRADE[grade][enhancementLevel][statIndex] || 0;
        }
        
        return 0;
    }

    calculateSetDeckBonus(cardData, setDeckState, stat) {
        let bonus = 0;
        const { playerInfo } = cardData;
        const { selectedSetDeckOptions } = setDeckState;

        for (const score in selectedSetDeckOptions) {
            const selection = selectedSetDeckOptions[score];
            if (!selection || !selection.optionKey) continue;

            const tierData = SET_DECK_TIERS[score];
            if (!tierData) continue;

            const selectedOption = tierData[selection.optionKey];
            if (!selectedOption || !selectedOption.bonus) continue;

            let applyBonus = false;
            const isBatter = !['SP', 'RP', 'CP'].includes(playerInfo.position);
            const isPitcher = ['SP', 'RP', 'CP'].includes(playerInfo.position);
            const optionType = selectedOption.type;

            if (optionType === 'team') {
                if (selection.team && playerInfo.team === selection.team) {
                    applyBonus = true;
                }
            } else if (optionType === 'year') {
                if (selection.year && playerInfo.year === selection.year) {
                    applyBonus = true;
                }
            } else if (optionType === 'year_and_position') {
                if (selection.year && playerInfo.year === selection.year) {
                    if (selectedOption.condition.position === 'batter' && isBatter) applyBonus = true;
                    if (selectedOption.condition.position === 'pitcher' && isPitcher) applyBonus = true;
                }
            } else if (optionType === 'team_and_grade') {
                if (selection.team && playerInfo.team === selection.team && selectedOption.condition.grades.includes(playerInfo.grade)) {
                    applyBonus = true;
                }
            } else if (optionType === 'team_and_position') {
                if (selection.team && playerInfo.team === selection.team) {
                    if (selectedOption.condition.position === 'batter' && isBatter) applyBonus = true;
                    if (selectedOption.condition.position === 'pitcher' && isPitcher) applyBonus = true;
                }
            } else if (optionType === 'grade') {
                if (selectedOption.condition.includes(playerInfo.grade)) applyBonus = true;
            } else if (optionType === 'position') {
                if (selectedOption.condition === 'batter' && isBatter) applyBonus = true;
                if (selectedOption.condition === 'pitcher' && isPitcher) applyBonus = true;
            } else if (optionType === 'star_and_position') {
                if (String(selectedOption.condition.star) === String(playerInfo.star)) {
                    if (isBatter && selectedOption.bonus.batter) applyBonus = true;
                    if (isPitcher && selectedOption.bonus.pitcher) applyBonus = true;
                    if (selectedOption.bonus.all) applyBonus = true;
                }
            } else if (optionType === 'pitcher_role') {
                if (isPitcher) {
                    if (selectedOption.condition === 'starter' && playerInfo.position === 'SP') applyBonus = true;
                    if (selectedOption.condition === 'reliever' && ['RP', 'CP'].includes(playerInfo.position)) applyBonus = true;
                }
            } else if (optionType === 'position_group') {
                if (selectedOption.condition.includes(playerInfo.position)) applyBonus = true;
            } else if (optionType === 'team_group') {
                if (selectedOption.condition.includes(playerInfo.team)) applyBonus = true;
            }

            if (applyBonus) {
                if (selectedOption.bonus.all) {
                    bonus += selectedOption.bonus.all;
                } else if (isBatter && selectedOption.bonus.batter && selectedOption.bonus.batter[stat]) {
                    bonus += selectedOption.bonus.batter[stat];
                } else if (isPitcher && selectedOption.bonus.pitcher && selectedOption.bonus.pitcher[stat]) {
                    bonus += selectedOption.bonus.pitcher[stat];
                } else if (selectedOption.bonus[stat]) {
                    bonus += selectedOption.bonus[stat];
                }
            }
        }
        return bonus;
    }

    getActiveCards() {
        return this.cards.filter(card => card.isActive && card.playerInfo.grade && card.playerInfo.star);
    }

    removeCard(cardId) {
        this.cards = this.cards.filter(card => card.id !== cardId);
    }

    resetAllCards() {
        this.cards = [];
    }
}

const cardCalculator = new CardCalculator();
