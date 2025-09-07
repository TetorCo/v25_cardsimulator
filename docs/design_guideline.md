컴투스프로야구V25 카드 성장 시뮬레이터: 디자인 가이드라인
문서 버전: 1.0
작성일: 2025년 9월 6일

1. 디자인 철학
직관성 (Intuitive): 사용자가 설명 없이도 기능을 쉽게 이해하고 사용할 수 있어야 한다.

정보 중심 (Information-centric): 불필요한 장식은 최소화하고, 시뮬레이션 결과와 비교 데이터를 명확하게 전달하는 데 집중한다.

게임과의 통일성 (Consistent with Game): 컴투스프로야구V25 게임의 전반적인 UI 톤앤매너를 따르되, 웹 환경에 맞게 간소화하여 사용자에게 친숙함을 제공한다.

반응형 (Responsive): 데스크탑, 태블릿, 모바일 등 모든 디바이스에서 최적의 사용성을 제공한다.

2. 색상 팔레트 (Color Palette)
배경 (Background): 어두운 계열의 색상을 사용하여 게임의 분위기를 재현하고 콘텐츠에 집중할 수 있도록 한다.

Primary Background: #1A1A2E (어두운 네이비)

Secondary Background (Card UI): #2A2A4E (한 톤 밝은 네이비)

텍스트 (Text):

Primary Text: #FFFFFF (기본 텍스트)

Secondary Text: #A0A0B5 (보조 설명, 라벨)

포인트 색상 (Accent Colors)::

Primary Accent: #F9B233 (골드 계열, 버튼, 하이라이트, 추천 표시)

Positive Accent: #33A5F9 (능력치 상승 등 긍정적 변화)

Chart Colors: 시각적 구분을 위한 다채로운 색상 세트 (예: Chart.js 기본 팔레트 활용)

3. 타이포그래피 (Typography)
기본 글꼴: Noto Sans KR (웹폰트) - 뛰어난 가독성 제공.

글꼴 크기:

H1 (페이지 제목): 32px, Bold

H2 (섹션 제목): 24px, Bold

H3 (카드 이름): 20px, Medium

Body: 16px, Regular

Label / Caption: 14px, Regular

4. 레이아웃 및 컴포넌트
4.1. 전체 레이아웃
최대 너비: 1280px로 제한하여 와이드 스크린에서도 콘텐츠가 중앙에 정렬되도록 한다.

모바일 우선: 모바일 화면(1열)을 기준으로 디자인하고, 화면 폭이 넓어짐에 따라 2열, 3열 구조로 확장되도록 반응형 그리드를 적용한다.

4.2. 핵심 컴포넌트
카드 시뮬레이터 UI (Card Simulator Pod):

하나의 카드에 대한 모든 정보 입력과 결과 출력이 이루어지는 독립된 컴포넌트.

상단: 선수 기본 정보 입력 필드 (텍스트, 드롭다운).

중단: 기본 능력치 입력 필드.

하단: 강화/훈련 조절 슬라이더 및 최종 결과(능력치, OVR) 디스플레이.

모든 값 변경 시 결과는 실시간으로 업데이트되어야 한다.

버튼 (Button):

Primary Button (+ 카드 추가): 골드 배경(Primary Accent)에 흰색 텍스트. 마우스 오버 시 밝기 변화.

Secondary Button (초기화): 투명 배경에 흰색 테두리와 텍스트.

입력 필드 (Input & Slider):

Text/Number Input: 어두운 배경에 흰색 텍스트, 포커스 시 골드 테두리.

Slider: 골드 색상의 트랙과 핸들을 사용하여 직관적인 조작이 가능하도록 디자인.

비교 차트 (Comparison Chart):

Chart.js의 레이더 차트를 기본으로 사용하여 여러 능력치를 한눈에 비교할 수 있도록 한다.

각 카드는 고유한 색상으로 표시하여 쉽게 구분할 수 있도록 한다.

차트 하단에 범례(Legend)를 반드시 포함한다.

추천 태그 (Recommendation Tag):

비교 결과 가장 우수한 카드의 상단에 눈에 띄는 골드 색상의 '추천' 배지를 표시한다.