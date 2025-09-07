// 컴투스프로야구V25 카드 성장 시뮬레이터 - 차트 관리
// Chart.js를 이용한 시각화 담당 모듈

class ChartManager {
    constructor() {
        this.chartInstance = null;
        this.chartColors = CHART_COLORS; // constants.js에서 가져옴
    }

    // 차트 업데이트 또는 새로 생성
    updateChart(cards) {
        const chartContainer = document.getElementById('comparison-chart');
        if (!chartContainer) {
            console.error("Chart container not found!");
            return;
        }

        // 기존 차트 인스턴스가 있으면 파괴
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // 활성화된 카드가 2장 미만이면 차트 숨김
        if (cards.length < 2) {
            chartContainer.innerHTML = ''; // 차트 내용 비우기
            return;
        }

        // 차트 데이터 준비
        const labels = ['파워', '정확', '선구', '주루', '인내', '수비']; // 기본 타자 스탯
        // TODO: 포지션에 따라 라벨 동적으로 변경 필요 (app_specification.md 참조)
        // 현재는 모든 카드가 타자라고 가정

        const datasets = cards.map((card, index) => {
            const isPitcher = card.playerInfo.position === 'P';
            const stats = isPitcher ? ['velocity', 'control', 'movement', 'breaking', 'stamina', 'fielding'] : ['power', 'contact', 'discipline', 'speed', 'patience', 'fielding'];
            const data = stats.map(stat => card.finalStats[stat] || 0);

            return {
                label: card.playerInfo.name || `카드 ${card.id}`,
                data: data,
                backgroundColor: this.chartColors[index % this.chartColors.length] + '40', // 40은 투명도
                borderColor: this.chartColors[index % this.chartColors.length],
                borderWidth: 1,
                fill: true,
            };
        });

        const data = {
            labels: labels,
            datasets: datasets,
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: '#444' // 눈금선 색상
                        },
                        grid: {
                            color: '#444' // 그리드 선 색상
                        },
                        pointLabels: {
                            color: '#A0A0B5', // 스탯 라벨 색상
                            font: {
                                size: 12
                            }
                        },
                        suggestedMin: 0,
                        suggestedMax: 150, // 능력치 최대값 (임시)
                        ticks: {
                            color: '#A0A0B5', // 눈금 값 색상
                            backdropColor: 'transparent' // 눈금 배경 투명
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF' // 범례 텍스트 색상
                        }
                    }
                }
            },
        };

        // 차트 생성
        this.chartInstance = new Chart(chartContainer, config);
    }
}

// 전역 인스턴스 생성
const chartManager = new ChartManager();
