// 컴투스프로야구V25 카드 성장 시뮬레이터 - 상수 데이터
// 게임 내 수치를 기반으로 한 상수값들

// 강화 보너스 테이블 (등급별, 강화단계별)
// 타자 스탯 배열 순서: [파워, 정확, 선구, 주루, 인내, 수비]
// 투수 스탯 배열 순서: [구속, 제구, 구위, 변화, 지구력, 수비]
const ENHANCEMENT_BONUSES_BY_GRADE = {
    '임팩트': [
        [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2], [3, 3, 3, 3, 3, 3], [4, 4, 4, 4, 4, 4], [5, 5, 5, 5, 5, 5],
        [8, 6, 6, 6, 6, 6], [9, 9, 7, 7, 7, 7], [10, 10, 10, 8, 8, 8], [11, 13, 11, 9, 9, 9], [14, 14, 12, 10, 10, 10]
    ],
    '시그니처': [
        [0, 0, 0, 0, 0, 0], [2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4], [6, 6, 6, 6, 6, 6], [8, 8, 8, 8, 8, 8], [10, 10, 10, 10, 10, 10],
        [14, 12, 12, 12, 12, 12], [16, 16, 14, 14, 14, 14], [18, 18, 18, 16, 16, 16], [20, 22, 20, 18, 18, 18], [24, 24, 22, 20, 20, 20]
    ],
    '국가대표': [
        [0, 0, 0, 0, 0, 0], [2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4], [6, 6, 6, 6, 6, 6], [8, 8, 8, 8, 8, 8], [10, 10, 10, 10, 10, 10],
        [14, 12, 12, 12, 12, 12], [16, 16, 14, 14, 14, 14], [18, 18, 18, 16, 16, 16], [20, 22, 20, 18, 18, 18], [24, 24, 22, 20, 20, 20]
    ],
    '골든글러브': [
        [0, 0, 0, 0, 0, 0], [2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4], [6, 6, 6, 6, 6, 6], [8, 8, 8, 8, 8, 8], [10, 10, 10, 10, 10, 10],
        [14, 12, 12, 12, 12, 12], [16, 16, 14, 14, 14, 14], [18, 18, 18, 16, 16, 16], [20, 22, 20, 18, 18, 18], [25, 25, 23, 21, 21, 21]
    ],
    '라이브': [
        [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2], [3, 3, 3, 3, 3, 3], [4, 4, 4, 4, 4, 4], [5, 5, 5, 5, 5, 5],
        [8, 6, 6, 6, 6, 6], [9, 9, 7, 7, 7, 7], [10, 10, 10, 8, 8, 8], [11, 13, 11, 9, 9, 9], [14, 14, 12, 10, 10, 10]
    ],
    '라이브 올스타': [
        [0, 0, 0, 0, 0, 0], [2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4], [6, 6, 6, 6, 6, 6], [8, 8, 8, 8, 8, 8], [10, 10, 10, 10, 10, 10],
        [14, 12, 12, 12, 12, 12], [16, 16, 14, 14, 14, 14], [18, 18, 18, 16, 16, 16], [20, 22, 20, 18, 18, 18], [24, 24, 22, 20, 20, 20]
    ],
    '시즌': [
        [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2], [3, 3, 3, 3, 3, 3], [4, 4, 4, 4, 4, 4], [5, 5, 5, 5, 5, 5],
        [8, 6, 6, 6, 6, 6], [9, 9, 7, 7, 7, 7], [10, 10, 10, 8, 8, 8], [11, 13, 11, 9, 9, 9], [14, 14, 12, 10, 10, 10]
    ]
};

// 세트덱 보너스 규칙 (타자용)
const SET_DECK_RULES = {
    // 팀 덱 보너스 (타자: 파워, 정확, 선구, 주루, 인내, 수비)
    team: {
        '키움': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        'LG': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '두산': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '한화': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '삼성': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '롯데': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        'NC': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        'KT': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        'SSG': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        'KIA': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 }
    },
    
    // 연도 덱 보너스 (타자)
    year: {
        '22': { power: 1, contact: 1, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '23': { power: 1, contact: 1, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '24': { power: 1, contact: 1, discipline: 1, speed: 1, patience: 1, fielding: 1 }
    },
    
    // 등급 덱 보너스 (타자)
    grade: {
        '라이브': { power: 1, contact: 1, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '라이브 올스타': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '시즌': { power: 2, contact: 2, discipline: 1, speed: 1, patience: 1, fielding: 1 },
        '임팩트': { power: 3, contact: 3, discipline: 2, speed: 2, patience: 2, fielding: 2 },
        '시그니처': { power: 4, contact: 4, discipline: 3, speed: 3, patience: 3, fielding: 3 },
        '골든글러브': { power: 5, contact: 5, discipline: 4, speed: 4, patience: 4, fielding: 4 },
        '국가대표': { power: 6, contact: 6, discipline: 5, speed: 5, patience: 5, fielding: 5 }
    }
};

// 투수 세트덱 보너스 규칙 (투수: 구속, 제구, 구위, 변화, 지구력, 수비)
const PITCHER_SET_DECK_RULES = {
    team: {
        '키움': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        'LG': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '두산': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '한화': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '삼성': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '롯데': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        'NC': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        'KT': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        'SSG': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        'KIA': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 }
    },
    
    year: {
        '22': { velocity: 1, control: 1, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '23': { velocity: 1, control: 1, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '24': { velocity: 1, control: 1, movement: 1, breaking: 1, stamina: 1, fielding: 1 }
    },
    
    grade: {
        '라이브': { velocity: 1, control: 1, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '라이브 올스타': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '시즌': { velocity: 2, control: 2, movement: 1, breaking: 1, stamina: 1, fielding: 1 },
        '임팩트': { velocity: 3, control: 3, movement: 2, breaking: 2, stamina: 2, fielding: 2 },
        '시그니처': { velocity: 4, control: 4, movement: 3, breaking: 3, stamina: 3, fielding: 3 },
        '골든글러브': { velocity: 5, control: 5, movement: 4, breaking: 4, stamina: 4, fielding: 4 },
        '국가대표': { velocity: 6, control: 6, movement: 5, breaking: 5, stamina: 5, fielding: 5 }
    }
};

// 포지션별 핵심 능력치 정의 (추천 알고리즘용)
const POSITION_KEY_STATS = {
    // 타자 포지션 (새로운 능력치 구조)
    '1B': ['power', 'contact'], // 1루수: 파워, 정확
    '2B': ['contact', 'speed'], // 2루수: 정확, 주루
    '3B': ['power', 'fielding'], // 3루수: 파워, 수비
    'SS': ['contact', 'fielding'], // 유격수: 정확, 수비
    'LF': ['power', 'contact'], // 좌익수: 파워, 정확
    'CF': ['speed', 'fielding'], // 중견수: 주루, 수비
    'RF': ['power', 'contact'], // 우익수: 파워, 정확
    'C': ['contact', 'fielding'], // 포수: 정확, 수비
    
    // 투수 포지션 (새로운 능력치 구조)
    'P': ['velocity', 'control'] // 투수: 구속, 제구
};

// 차트 색상 팔레트
const CHART_COLORS = [
    '#F9B233', // 골드
    '#33A5F9', // 블루
    '#FF6B6B', // 레드
    '#4ECDC4', // 틸
    '#45B7D1', // 스카이블루
    '#96CEB4', // 민트
    '#FFEAA7', // 옐로우
    '#DDA0DD'  // 플럼
];

// 최대 카드 수
const MAX_CARDS = 3;

// 훈련 포인트 최대값 (등급 및 성별)
const MAX_TRAINING_POINTS = {
    '라이브': { '4': 69, '5': 75 },
    '시즌': { '4': 54, '5': 60 },
    '골든글러브': { '4': 54, '5': 75 },
    '임팩트': { '4': 54 },
    '시그니처': { '5': 75 },
    '라이브 올스타': { '5': 75 },
    '국가대표': { '5': 60 }
};

// 세트덱 스코어별 보너스 규칙
const SET_DECK_TIERS = {
    30: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team', // Requires global team selection
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    40: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    50: {
        optionA: {
            label: "시즌 & 라이브 & 라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    55: {
        optionA: {
            label: "선택 연도 타자: 주루, 수비 +2",
            type: 'year_and_position',
            condition: { position: 'batter' },
            bonus: { speed: 2, fielding: 2 }
        },
        optionB: {
            label: "선택 연도 투수: 변화, 지구력 +2",
            type: 'year_and_position',
            condition: { position: 'pitcher' },
            bonus: { breaking: 2, stamina: 2 }
        }
    },
    60: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    70: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    80: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    90: {
        optionA: {
            label: "시즌 & 라이브 & 라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    100: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "선택 연도 선수: 모든 능력치 +1",
            type: 'year',
            bonus: { all: 1 }
        }
    },
    110: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    120: {
        optionA: {
            label: "시즌 & 라이브 & 라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    130: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "선택 연도 선수: 모든 능력치 +1",
            type: 'year',
            bonus: { all: 1 }
        }
    },
    140: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    150: {
        optionA: {
            label: "시즌 & 라이브 & 라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    160: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "선택 연도 선수: 모든 능력치 +1",
            type: 'year',
            bonus: { all: 1 }
        }
    },
    170: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    },
    180: {
        optionA: {
            label: "시즌 & 라이브 & 라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트 & 국가대표 & 시그니처 & 골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    190: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "선택 연도 선수: 모든 능력치 +1",
            type: 'year',
            bonus: { all: 1 }
        }
    },
    200: {
        optionA: {
            label: "타자: 모든 능력치 +1",
            type: 'position',
            condition: 'batter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "투수: 모든 능력치 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { all: 1 }
        }
    }
};

// 팀 목록
const TEAMS = ['키움', 'LG', '두산', '한화', '삼성', '롯데', 'NC', 'KT', 'SSG', 'KIA'];

// 연도 목록 (1982년부터 2025년까지)
const YEARS = Array.from({ length: 2025 - 1982 + 1 }, (_, i) => (1982 + i).toString());
