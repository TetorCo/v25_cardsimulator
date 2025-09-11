// 컴투스프로야구V25 카드 성장 시뮬레이터 - 상수 데이터
// 게임 내 수치를 기반으로 한 상수값들

// 포지션 그룹 정의
const POSITIONS = {
    batter: {
        '내야수': '내야수',
        '외야수': '외야수',
        '포수': '포수',
        '지명타자': '지명타자'
    },
    pitcher: {
        '선발투수': '선발투수',
        '불펜투수': '불펜투수'
    }
};

const BATTER_STATS = ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
const BATTER_STAT_LABELS = ['파워', '정확', '선구', '주루', '인내', '수비'];
const PITCHER_STATS = ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'];
const PITCHER_STAT_LABELS = ['구속', '제구', '구위', '변화', '지구력', '수비'];


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
    '내야수': ['power', 'contact', 'fielding'],
    '외야수': ['power', 'contact', 'speed', 'fielding'],
    '포수': ['contact', 'fielding'],
    '지명타자': ['power', 'contact'],
    '선발투수': ['velocity', 'control', 'stamina'],
    '불펜투수': ['velocity', 'control', 'breaking']
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
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +1",
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
            label: "시즌&라이브&라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +1",
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
    65: {
        optionA: {
            label: "3성 선수: 모든 능력치 +2",
            type: 'star_and_position',
            condition: { star: 3 },
            bonus: { all: 2 }
        },
        optionB: {
            label: "4성 선수: 타자 - 정확, 인내 +2 / 투수 - 구속, 제구 +2",
            type: 'star_and_position',
            condition: { star: 4 },
            bonus: { 
                batter: { contact: 2, patience: 2 },
                pitcher: { velocity: 2, control: 2 }
            }
        }
    },
    70: {
        optionA: {
            label: "선발 투수: 모든 능력치 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { all: 1 }
        },
        optionB: {
            label: "불펜 투수(중간 계투, 마무리): 모든 능력치 +2",
            type: 'pitcher_role',
            condition: 'reliever',
            bonus: { all: 2 }
        }
    },
    75: {
        optionA: {
            label: "선택 연도 타자: 파워, 정확 +3",
            type: 'year_and_position',
            condition: { position: 'batter' },
            bonus: { power: 3, contact: 3 }
        },
        optionB: {
            label: "선택 연도 투수: 구위, 제구 +3",
            type: 'year_and_position',
            condition: { position: 'pitcher' },
            bonus: { movement: 3, control: 3 }
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
    85: {
        optionA: {
            label: "4성 선수: 타자 - 정확, 선구, 파워 +2 / 투수 - 구위, 변화, 제구 +2",
            type: 'star_and_position',
            condition: { star: 4 },
            bonus: {
                batter: { contact: 2, discipline: 2, power: 2 },
                pitcher: { movement: 2, breaking: 2, control: 2 }
            }
        },
        optionB: {
            label: "5성 선수: 타자 - 파워 +1 / 투수 - 구위 +1",
            type: 'star_and_position',
            condition: { star: 5 },
            bonus: {
                batter: { power: 1 },
                pitcher: { movement: 1 }
            }
        }
    },
    90: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +2",
            type: 'team',
            bonus: { all: 2 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +2",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 2 }
        }
    },
    95: {
        optionA: {
            label: "내야수, 포수: 인내, 수비 +2",
            type: 'position_group',
            condition: ['내야수', '포수'],
            bonus: { patience: 2, fielding: 2 }
        },
        optionB: {
            label: "외야수, 지명타자: 선구, 주루 +2",
            type: 'position_group',
            condition: ['외야수', '지명타자'],
            bonus: { discipline: 2, speed: 2 }
        }
    },
    100: {
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
    105: {
        optionA: {
            label: "3성 선수: 모든 능력치 +2",
            type: 'star_and_position',
            condition: { star: 3 },
            bonus: { all: 2 }
        },
        optionB: {
            label: "4성 선수: 타자 - 파워, 선구 +2 / 투수 - 구위, 변화 +2",
            type: 'star_and_position',
            condition: { star: 4 },
            bonus: {
                batter: { power: 2, discipline: 2 },
                pitcher: { movement: 2, breaking: 2 }
            }
        }
    },
    110: {
        optionA: {
            label: "두산, 롯데, 삼성, SSG, KT 선수: 모든 능력치 +1",
            type: 'team_group',
            condition: ['두산', '롯데', '삼성', 'SSG', 'KT'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "KIA, 한화, LG, NC, 키움 선수: 모든 능력치 +1",
            type: 'team_group',
            condition: ['KIA', '한화', 'LG', 'NC', '키움'],
            bonus: { all: 1 }
        }
    },
    115: {
        optionA: {
            label: "하위 타선(6~9번 타자): 정확, 주루, 수비 +2",
            type: 'batting_order',
            condition: 'lower',
            bonus: { contact: 2, speed: 2, fielding: 2 }
        },
        optionB: {
            label: "불펜 투수(중간 계투, 마무리): 제구, 구위, 지구력 +2",
            type: 'pitcher_role',
            condition: 'reliever',
            bonus: { control: 2, movement: 2, stamina: 2 }
        }
    },
    120: {
        optionA: {
            label: "중심 타선(3~5번 타자): 모든 능력치 +2",
            type: 'batting_order',
            condition: 'cleanup',
            bonus: { all: 2 }
        },
        optionB: {
            label: "선발 투수: 모든 능력치 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { all: 1 }
        }
    },
    125: {
        optionA: {
            label: "4성 선수: 타자 - 정확, 선구, 인내 +2 / 투수 - 구속, 변화, 제구 +2",
            type: 'star_and_position',
            condition: { star: 4 },
            bonus: {
                batter: { contact: 2, discipline: 2, patience: 2 },
                pitcher: { velocity: 2, breaking: 2, control: 2 }
            }
        },
        optionB: {
            label: "5성 선수: 타자 - 인내 +1 / 투수 - 제구 +1",
            type: 'star_and_position',
            condition: { star: 5 },
            bonus: {
                batter: { patience: 1 },
                pitcher: { control: 1 }
            }
        }
    },
    130: {
        optionA: {
            label: "시즌&라이브&라이브 올스타 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['시즌', '라이브', '라이브 올스타'],
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    135: {
        optionA: {
            label: "중심 타선(3~5번 타자): 정확, 주루, 수비 +2",
            type: 'batting_order',
            condition: 'cleanup',
            bonus: { contact: 2, speed: 2, fielding: 2 }
        },
        optionB: {
            label: "선발 투수: 제구, 구위, 지구력 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { control: 1, movement: 1, stamina: 1 }
        }
    },
    140: {
        optionA: {
            label: "하위 타선(6~9번 타자): 모든 능력치 +1",
            type: 'batting_order',
            condition: 'lower',
            bonus: { all: 1 }
        },
        optionB: {
            label: "불펜 투수(중간 계투, 마무리): 모든 능력치 +1",
            type: 'pitcher_role',
            condition: 'reliever',
            bonus: { all: 1 }
        }
    },
    145: {
        optionA: {
            label: "상위 타선(1~2번 타자): 정확, 주루, 선구 +2",
            type: 'batting_order',
            condition: 'leadoff',
            bonus: { contact: 2, speed: 2, discipline: 2 }
        },
        optionB: {
            label: "선발 투수: 제구, 구위, 지구력 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { control: 1, movement: 1, stamina: 1 }
        }
    },
    150: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +2",
            type: 'team',
            bonus: { all: 2 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +2",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 2 }
        }
    },
    155: {
        optionA: {
            label: "상위 타선(1~2번 타자): 파워, 선구, 인내 +2",
            type: 'batting_order',
            condition: 'leadoff',
            bonus: { power: 2, discipline: 2, patience: 2 }
        },
        optionB: {
            label: "선발 투수: 구속, 변화, 수비 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { velocity: 1, breaking: 1, fielding: 1 }
        }
    },
    160: {
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
    165: {
        optionA: {
            label: "타자: 정확, 주루, 수비 +1",
            type: 'position',
            condition: 'batter',
            bonus: { contact: 1, speed: 1, fielding: 1 }
        },
        optionB: {
            label: "투수: 구속, 변화, 수비 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { velocity: 1, breaking: 1, fielding: 1 }
        }
    },
    170: {
        optionA: {
            label: "선택 팀 선수: 모든 능력치 +1",
            type: 'team',
            bonus: { all: 1 }
        },
        optionB: {
            label: "임팩트&국가대표&시그니처&골든글러브 카드: 모든 능력치 +1",
            type: 'grade',
            condition: ['임팩트', '국가대표', '시그니처', '골든글러브'],
            bonus: { all: 1 }
        }
    },
    175: {
        optionA: {
            label: "타자: 파워, 선구, 인내 +1",
            type: 'position',
            condition: 'batter',
            bonus: { power: 1, discipline: 1, patience: 1 }
        },
        optionB: {
            label: "투수: 제구, 구위, 지구력 +1",
            type: 'position',
            condition: 'pitcher',
            bonus: { control: 1, movement: 1, stamina: 1 }
        }
    },
    180: {
        optionA: {
            label: "라이브&라이브 올스타 카드: 모든 능력치 +2",
            type: 'grade',
            condition: ['라이브', '라이브 올스타'],
            bonus: { all: 2 }
        },
        optionB: {
            label: "선택 연도 선수: 모든 능력치 + 1",
            type: 'year',
            bonus: { all: 1 }
        }
    },
    185: {
        optionA: {
            label: "상위 타선(1~2번 타자): 파워 +2, 주루 +2",
            type: 'batting_order',
            condition: 'leadoff',
            bonus: { power: 2, speed: 2 }
        },
        optionB: {
            label: "선택 연도 타자: 모든 능력치 +1",
            type: 'year_and_position',
            condition: { position: 'batter' },
            bonus: { all: 1 }
        }
    },
    190: {
        optionA: {
            label: "선발 투수: 구위 +1, 지구력 +1",
            type: 'pitcher_role',
            condition: 'starter',
            bonus: { movement: 1, stamina: 1 }
        },
        optionB: {
            label: "선택 연도 투수: 모든 능력치 +1",
            type: 'year_and_position',
            condition: { position: 'pitcher' },
            bonus: { all: 1 }
        }
    },
    195: {
        optionA: {
            label: "선택 팀 라이브&라이브 올스타&국가대표: 모든 능력치 +1",
            type: 'team_and_grade',
            condition: { grades: ['라이브', '라이브 올스타', '국가대표'] },
            bonus: { all: 1 }
        },
        optionB: {
            label: "선택 팀 시그니처: 모든 능력치 +1",
            type: 'team_and_grade',
            condition: { grades: ['시그니처'] },
            bonus: { all: 1 }
        }
    },
    200: {
        optionA: {
            label: "선택 팀 타자: 모든 능력치 +2",
            type: 'team_and_position',
            condition: { position: 'batter' },
            bonus: { all: 2 }
        },
        optionB: {
            label: "선택 팀 투수: 모든 능력치 +2",
            type: 'team_and_position',
            condition: { position: 'pitcher' },
            bonus: { all: 2 }
        }
    }
};

// 팀 목록
const TEAMS = ['키움', 'LG', '두산', '한화', '삼성', '롯데', 'NC', 'KT', 'SSG', 'KIA'];

// 연도 목록 (1982년부터 2025년까지)
const YEARS = Array.from({ length: 2025 - 1982 + 1 }, (_, i) => (1982 + i).toString());