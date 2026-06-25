"""
강아지 유치원 실시간 모니터링 - 영상 처리 서버
YOLO + ByteTrack + ReID 기반 강아지 탐지, 트래킹, 식별
"""

import os
import sys
import unicodedata

import cv2
import numpy as np
from PIL import ImageFont, ImageDraw, Image as PILImage
from ultralytics import YOLO
from reid import DogReID
from behavior import BehaviorAnalyzer

# 한글 폰트 설정 (macOS)
_FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
_font_cache = {}


def _get_font(size):
    if size not in _font_cache:
        _font_cache[size] = ImageFont.truetype(_FONT_PATH, size)
    return _font_cache[size]


def put_text_korean(img, text, pos, font_size=24, color=(0, 255, 0)):
    """OpenCV 이미지에 한글 텍스트를 렌더링"""
    text = unicodedata.normalize("NFC", text)
    img_pil = PILImage.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(img_pil)
    font = _get_font(font_size)
    draw.text(pos, text, font=font, fill=(color[2], color[1], color[0]))
    return cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

DOGS_FOLDER = os.path.join(os.path.dirname(__file__), "dogs")


def register_mode(cap, model, reid):
    """등록 모드: 's'로 이름 지정, 이름 붙은 강아지는 자동 샘플 수집"""
    print("\n=== 등록 모드 ===")
    print("  's' = 일시정지 → 모든 강아지 이름 입력")
    print("  'q' = 등록 완료 → 트래킹 시작")
    print("  이름이 지정된 강아지는 자동으로 샘플이 수집됩니다.\n")

    # 트래킹 ID → 이름
    names = {}
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        frame_count += 1

        results = model.track(
            frame,
            classes=[16],
            tracker="bytetrack.yaml",
            persist=True,
            conf=0.3,
            iou=0.4,
            device="mps",
            verbose=False,
        )

        annotated = results[0].plot()

        if results[0].boxes.id is not None:
            ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xyxy.cpu().tolist()

            for idx, (track_id, box) in enumerate(zip(ids, boxes)):
                x1, y1, x2, y2 = [int(v) for v in box]
                crop = frame[y1:y2, x1:x2]

                # 이름이 있는 강아지는 10프레임마다 자동 샘플 수집
                if track_id in names and crop.size > 0 and frame_count % 10 == 0:
                    reid.add_sample(names[track_id], crop)

                # 화면에 번호 + 이름 + 샘플 수 표시
                num = idx + 1
                if track_id in names:
                    dog_name = names[track_id]
                    sample_cnt = len(reid._pending_features.get(dog_name, []))
                    label = f"{num}: {dog_name} ({sample_cnt})"
                    color = (0, 255, 0)
                else:
                    label = f"{num}: ???"
                    color = (0, 165, 255)

                annotated = put_text_korean(annotated, label, (x1, y1 - 30), font_size=24, color=color)

        # 상태 바
        named = [n for n in names.values()]
        status = f"[등록모드] 's'=이름지정, 'q'=완료 | {', '.join(named) or '아직 없음'}"
        annotated = put_text_korean(annotated, status, (10, 5), font_size=20, color=(0, 255, 255))

        cv2.imshow("Dog Tracker", annotated)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("s"):
            if results[0].boxes.id is None:
                print("  강아지가 탐지되지 않았습니다.")
                continue

            ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xyxy.cpu().tolist()

            # 모든 강아지 크롭 창 띄우기
            crops_data = []
            for idx, (track_id, box) in enumerate(zip(ids, boxes)):
                x1, y1, x2, y2 = [int(v) for v in box]
                crop = frame[y1:y2, x1:x2]
                num = idx + 1
                crops_data.append((num, track_id, crop))

                if crop.size > 0:
                    display = cv2.resize(crop, (200, 200))
                    name_label = names.get(track_id, "???")
                    display = put_text_korean(display, f"#{num}: {name_label}", (5, 5), font_size=20, color=(0, 255, 255))
                    cv2.imshow(f"Dog #{num}", display)

            cv2.waitKey(500)

            # 모든 강아지에 대해 순서대로 이름 입력
            print(f"\n  탐지된 강아지 {len(crops_data)}마리")
            for num, track_id, crop in crops_data:
                existing = names.get(track_id)
                if existing:
                    print(f"  #{num}: 이미 '{existing}'로 등록됨")
                    continue
                dog_name = input(f"  #{num}번 강아지 이름 (건너뛰려면 Enter): ").strip()
                if dog_name:
                    names[track_id] = dog_name
                    # 이름 지정과 동시에 현재 프레임도 샘플로 수집
                    if crop.size > 0:
                        reid.add_sample(dog_name, crop)
                    print(f"  #{num} → '{dog_name}' 등록!")

            # 크롭 창 닫기
            for num, _, _ in crops_data:
                cv2.destroyWindow(f"Dog #{num}")

        elif key == ord("q"):
            break

    # 수집된 샘플로 최종 등록
    reid.finalize_registration()

    if not reid.registry:
        print("등록된 강아지가 없습니다. 이름 없이 트래킹합니다.")
    else:
        print(f"\n등록 완료! {list(reid.registry.keys())} → 트래킹 모드로 전환합니다.\n")


def tracking_mode(cap, model, reid):
    """트래킹 모드: 실시간으로 강아지 식별, 추적, 행동 인식"""
    print("\n=== 트래킹 모드 === ('q'=종료, 'b'=행동표시 on/off)\n")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    behavior = BehaviorAnalyzer(fps=int(fps))
    show_behavior = False

    # 트래킹 ID → 강아지 이름 매핑 캐시
    id_to_name = {}

    # 행동별 색상
    behavior_colors = {
        "뛰기": (0, 0, 255),      # 빨강
        "걷기": (255, 165, 0),     # 파랑+
        "휴식": (200, 200, 200),   # 회색
        "수면": (180, 130, 70),    # 짙은 파랑
        "대기": (200, 200, 200),   # 회색
        "관찰중": (200, 200, 200), # 회색
    }

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.track(
            frame,
            classes=[16],
            tracker="bytetrack.yaml",
            persist=True,
            conf=0.3,
            iou=0.4,
            device="mps",
            verbose=False,
        )

        annotated = frame.copy()

        if results[0].boxes.id is not None:
            ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xyxy.cpu().tolist()

            # 1단계: 모든 박스의 ReID 점수를 먼저 계산
            candidates = []  # [(track_id, box, name, score)]
            for track_id, box in zip(ids, boxes):
                x1, y1, x2, y2 = [int(v) for v in box]
                name, score = None, 0.0
                if reid.registry:
                    crop = frame[y1:y2, x1:x2]
                    if crop.size > 0:
                        name, score = reid.identify(crop)
                candidates.append((track_id, box, name, score))

            # 2단계: 점수 높은 순으로 이름 할당 (중복 방지)
            used_names = set()
            frame_assignments = {}

            for track_id, box, name, score in candidates:
                if track_id in id_to_name:
                    cached = id_to_name[track_id]
                    if cached not in used_names:
                        frame_assignments[track_id] = cached
                        used_names.add(cached)

            for track_id, box, name, score in sorted(candidates, key=lambda x: x[3], reverse=True):
                if track_id in frame_assignments:
                    continue
                if name and name not in used_names:
                    id_to_name[track_id] = name
                    frame_assignments[track_id] = name
                    used_names.add(name)

            # 3단계: 행동 분석기에 데이터 전달
            detections = []
            for track_id, box, name, score in candidates:
                x1, y1, x2, y2 = [int(v) for v in box]
                dog_name = frame_assignments.get(track_id)
                detections.append((dog_name, x1, y1, x2, y2))
            behavior.update(detections)

            # 4단계: 그리기
            for track_id, box, name, score in candidates:
                x1, y1, x2, y2 = [int(v) for v in box]
                display_name = frame_assignments.get(track_id, f"#{track_id}")
                is_identified = track_id in frame_assignments

                # 행동 상태 가져오기
                action = ""
                if is_identified and show_behavior:
                    action = behavior.get_status_text(display_name)

                # 라벨: 이름 + 행동
                if action:
                    label = f"{display_name} [{action}]"
                else:
                    label = display_name

                # 행동에 따른 bbox 색상
                if not is_identified:
                    box_color = (0, 165, 255)  # 주황 (미식별)
                elif action in behavior_colors:
                    box_color = behavior_colors[action]
                else:
                    box_color = (0, 255, 0)

                cv2.rectangle(annotated, (x1, y1), (x2, y2), box_color, 2)
                font = _get_font(24)
                bbox = font.getbbox(label)
                tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                cv2.rectangle(annotated, (x1, y1 - th - 12), (x1 + tw + 4, y1), box_color, -1)
                annotated = put_text_korean(annotated, label, (x1 + 2, y1 - th - 10), font_size=24, color=(0, 0, 0))

            # 5단계: 상호작용 표시 (show_behavior일 때만)
            if show_behavior:
                alerts = behavior.get_alerts()
                interactions = behavior.get_all_interactions()

                if alerts:
                    annotated = put_text_korean(
                        annotated, f"!! 위험: {', '.join(f'{a}-{b}' for a, b in alerts)} !!",
                        (10, 5), font_size=28, color=(0, 0, 255),
                    )

                y_offset = annotated.shape[0] - 30
                for (n1, n2), interaction in interactions.items():
                    if interaction == "위험":
                        i_color = (0, 0, 255)
                    elif interaction == "놀이":
                        i_color = (0, 255, 0)
                    else:
                        i_color = (200, 200, 200)
                    text = f"{n1} + {n2}: {interaction}"
                    annotated = put_text_korean(annotated, text, (10, y_offset), font_size=20, color=i_color)
                    y_offset -= 28

        cv2.imshow("Dog Tracker", annotated)
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        elif key == ord("b"):
            show_behavior = not show_behavior
            print(f"  행동 표시: {'ON' if show_behavior else 'OFF'}")


def main():
    model = YOLO("yolov8s.pt")
    reid = DogReID()

    source = sys.argv[1] if len(sys.argv) > 1 else 0
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        print(f"영상 소스를 열 수 없습니다: {source}")
        return

    source_name = source if isinstance(source, str) else "웹캠"
    print(f"{source_name} 연결 성공!")

    # dogs 폴더가 있으면 이미지에서 자동 등록
    if os.path.isdir(DOGS_FOLDER):
        print(f"\n'{DOGS_FOLDER}' 폴더에서 강아지 등록 중...")
        reid.register_from_folder(DOGS_FOLDER)
    elif not reid.registry:
        print(f"\n'{DOGS_FOLDER}' 폴더가 없습니다. 영상에서 등록합니다.")
        register_mode(cap, model, reid)
        if isinstance(source, str):
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    if reid.registry:
        choice = input("\n추가 등록하려면 'r', 바로 시작하려면 Enter: ").strip()
        if choice == "r":
            register_mode(cap, model, reid)
            if isinstance(source, str):
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    # 트래킹 모드
    tracking_mode(cap, model, reid)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
