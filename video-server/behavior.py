"""
강아지 행동 인식 모듈
바운딩박스 기반 규칙 엔진 - 포즈 추정 없이 동작
모든 거리/속도는 bbox 크기 대비 상대값 사용
"""

from collections import defaultdict, deque
import math


class BehaviorAnalyzer:
    def __init__(self, fps=30):
        self.fps = fps

        # 강아지별 히스토리: deque of (cx, cy, w, h)
        self._history = defaultdict(lambda: deque(maxlen=fps * 15))  # 최대 15초
        # 강아지별 상대속도 히스토리
        self._speeds = defaultdict(lambda: deque(maxlen=fps * 15))
        # 강아지별 현재 행동
        self.states = {}  # name → 행동 문자열
        # 놀이/위험은 쌍 단위로 판단
        self.interactions = {}  # (name1, name2) → 상호작용 문자열

    def update(self, detections):
        """매 프레임마다 호출

        Args:
            detections: list of (name, x1, y1, x2, y2)
                name이 None이면 미식별 → 건너뜀
        """
        current = {}  # name → (cx, cy, w, h, diag)

        for name, x1, y1, x2, y2 in detections:
            if name is None:
                continue

            w = x2 - x1
            h = y2 - y1
            cx = (x1 + x2) / 2
            cy = (y1 + y2) / 2
            diag = math.sqrt(w * w + h * h)

            if diag < 1:
                continue

            self._history[name].append((cx, cy, w, h))

            # 상대속도 계산 (이전 프레임 대비)
            if len(self._history[name]) >= 2:
                prev = self._history[name][-2]
                dx = cx - prev[0]
                dy = cy - prev[1]
                dist = math.sqrt(dx * dx + dy * dy)
                rel_speed = dist / diag  # bbox 대각선 대비 이동 비율
            else:
                rel_speed = 0.0

            self._speeds[name].append(rel_speed)
            current[name] = (cx, cy, w, h, diag)

        # 개별 행동 판단
        for name in current:
            self.states[name] = self._classify_individual(name, current[name])

        # 상호작용 판단 (쌍별)
        names = list(current.keys())
        self.interactions.clear()
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                n1, n2 = names[i], names[j]
                interaction = self._classify_interaction(
                    n1, current[n1], n2, current[n2]
                )
                if interaction:
                    self.interactions[(n1, n2)] = interaction

    def _classify_individual(self, name, data):
        """개별 강아지 행동 분류"""
        cx, cy, w, h, diag = data
        speeds = self._speeds[name]

        if len(speeds) < self.fps:  # 최소 1초 데이터 필요
            return "관찰중"

        # 최근 N초 평균 속도
        recent_1s = list(speeds)[-self.fps:]
        avg_speed_1s = sum(recent_1s) / len(recent_1s)

        # --- 뛰기: 최근 1초 평균 상대속도 > 0.3 ---
        if avg_speed_1s > 0.3:
            return "뛰기"

        # --- 휴식/수면: 최근 3초간 거의 안 움직임 ---
        rest_frames = self.fps * 3
        if len(speeds) >= rest_frames:
            recent_3s = list(speeds)[-rest_frames:]
            avg_speed_3s = sum(recent_3s) / len(recent_3s)

            if avg_speed_3s < 0.05:
                # 수면 판단: 누운 자세 (가로가 세로보다 1.5배 이상)
                aspect = w / max(h, 1)
                if aspect > 1.5:
                    return "수면"
                return "휴식"

        # --- 걷기: 중간 속도 ---
        if avg_speed_1s > 0.08:
            return "걷기"

        return "대기"

    def _classify_interaction(self, name1, data1, name2, data2):
        """두 강아지 간 상호작용 분류"""
        cx1, cy1, w1, h1, diag1 = data1
        cx2, cy2, w2, h2, diag2 = data2

        # 두 강아지 중심 간 거리 (평균 대각선 대비)
        avg_diag = (diag1 + diag2) / 2
        dist = math.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2)
        rel_dist = dist / avg_diag

        # bbox IoU 계산
        iou = self._calc_iou(
            cx1 - w1 / 2, cy1 - h1 / 2, cx1 + w1 / 2, cy1 + h1 / 2,
            cx2 - w2 / 2, cy2 - h2 / 2, cx2 + w2 / 2, cy2 + h2 / 2,
        )

        # 두 강아지 최근 속도
        speeds1 = self._speeds.get(name1, deque())
        speeds2 = self._speeds.get(name2, deque())

        if len(speeds1) < self.fps or len(speeds2) < self.fps:
            return None

        recent1 = list(speeds1)[-self.fps:]
        recent2 = list(speeds2)[-self.fps:]
        avg_s1 = sum(recent1) / len(recent1)
        avg_s2 = sum(recent2) / len(recent2)

        # --- 위험(교상 의심): bbox 많이 겹침 + 격렬한 움직임 ---
        if iou > 0.3 and (avg_s1 > 0.2 or avg_s2 > 0.2):
            # 속도 변화(가속도)도 확인 - 급격한 변화
            if len(speeds1) >= self.fps * 2:
                prev1 = list(speeds1)[-self.fps * 2:-self.fps]
                prev_avg1 = sum(prev1) / len(prev1)
                accel1 = abs(avg_s1 - prev_avg1)
                if accel1 > 0.15:
                    return "위험"
            # 가속도 데이터 부족해도 IoU 높고 빠르면 위험
            if iou > 0.5 and (avg_s1 > 0.25 or avg_s2 > 0.25):
                return "위험"

        # --- 놀이: 가까이 있고 + 둘 다 움직임 ---
        if rel_dist < 2.0 and avg_s1 > 0.05 and avg_s2 > 0.05:
            return "놀이"

        # --- 가까이 있지만 한쪽만 움직임 ---
        if rel_dist < 1.5:
            return "접촉"

        return None

    @staticmethod
    def _calc_iou(x1a, y1a, x2a, y2a, x1b, y1b, x2b, y2b):
        """두 bbox의 IoU 계산"""
        xi1 = max(x1a, x1b)
        yi1 = max(y1a, y1b)
        xi2 = min(x2a, x2b)
        yi2 = min(y2a, y2b)

        inter = max(0, xi2 - xi1) * max(0, yi2 - yi1)
        if inter == 0:
            return 0.0

        area_a = (x2a - x1a) * (y2a - y1a)
        area_b = (x2b - x1b) * (y2b - y1b)
        union = area_a + area_b - inter

        return inter / union if union > 0 else 0.0

    def get_status_text(self, name):
        """특정 강아지의 현재 행동 텍스트"""
        return self.states.get(name, "")

    def get_alerts(self):
        """위험 상호작용 목록 반환"""
        alerts = []
        for (n1, n2), interaction in self.interactions.items():
            if interaction == "위험":
                alerts.append((n1, n2))
        return alerts

    def get_all_interactions(self):
        """모든 상호작용 반환"""
        return dict(self.interactions)
