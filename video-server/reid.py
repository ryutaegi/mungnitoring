"""
강아지 ReID - 특징 추출 및 유사도 비교
MobileNetV3 기반 경량 특징 추출기
"""

import os
import pickle

import numpy as np
import torch
import torchvision.transforms as T
from torchvision import models
from PIL import Image

REGISTRY_PATH = os.path.join(os.path.dirname(__file__), "dog_registry.pkl")


class DogReID:
    def __init__(self):
        # MobileNetV3 Small - M3 맥북에서 빠르게 동작
        self.model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        # 분류 헤드 제거 → 특징 벡터만 추출
        self.model.classifier = torch.nn.Identity()
        self.model.eval()

        self.device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        self.model.to(self.device)

        self.transform = T.Compose([
            T.Resize((224, 224)),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        # 등록된 강아지: {이름: 특징 벡터(평균)}
        self.registry = {}
        # 등록 중 누적 특징: {이름: [벡터1, 벡터2, ...]}
        self._pending_features = {}
        self.load()

    def extract_feature(self, crop_bgr):
        """바운딩박스로 잘린 이미지에서 특징 벡터 추출"""
        crop_rgb = crop_bgr[:, :, ::-1]  # BGR → RGB
        pil_img = Image.fromarray(crop_rgb)
        tensor = self.transform(pil_img).unsqueeze(0).to(self.device)

        with torch.no_grad():
            feature = self.model(tensor)

        feature = feature.cpu().numpy().flatten()
        feature = feature / np.linalg.norm(feature)  # L2 정규화
        return feature

    def add_sample(self, name, crop_bgr):
        """등록용 샘플 추가 (여러 장 수집)"""
        feature = self.extract_feature(crop_bgr)
        if name not in self._pending_features:
            self._pending_features[name] = []
        self._pending_features[name].append(feature)
        count = len(self._pending_features[name])
        print(f"  '{name}' 샘플 {count}장 수집됨")

    def finalize_registration(self):
        """수집된 샘플들을 평균내서 최종 등록"""
        for name, features in self._pending_features.items():
            avg_feature = np.mean(features, axis=0)
            avg_feature = avg_feature / np.linalg.norm(avg_feature)
            self.registry[name] = avg_feature
            print(f"'{name}' 등록 완료! ({len(features)}장 평균)")
        self._pending_features.clear()
        self.save()

    def register_from_folder(self, folder_path):
        """폴더에서 강아지 사진을 읽어서 등록

        구조: folder_path/강아지이름/사진.jpg
        """
        import cv2

        if not os.path.isdir(folder_path):
            print(f"폴더를 찾을 수 없습니다: {folder_path}")
            return

        for dog_name in sorted(os.listdir(folder_path)):
            dog_dir = os.path.join(folder_path, dog_name)
            if not os.path.isdir(dog_dir) or dog_name.startswith("."):
                continue

            features = []
            for img_file in sorted(os.listdir(dog_dir)):
                if not img_file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    continue
                img_path = os.path.join(dog_dir, img_file)
                img = cv2.imread(img_path)
                if img is None:
                    continue
                feature = self.extract_feature(img)
                features.append(feature)

            if features:
                avg_feature = np.mean(features, axis=0)
                avg_feature = avg_feature / np.linalg.norm(avg_feature)
                self.registry[dog_name] = avg_feature
                print(f"'{dog_name}' 등록 완료! ({len(features)}장)")

        if self.registry:
            self.save()
            print(f"\n총 {len(self.registry)}마리 등록: {list(self.registry.keys())}")

    def save(self):
        """등록 데이터를 파일로 저장"""
        with open(REGISTRY_PATH, "wb") as f:
            pickle.dump(self.registry, f)

    def load(self):
        """저장된 등록 데이터 불러오기"""
        if os.path.exists(REGISTRY_PATH):
            with open(REGISTRY_PATH, "rb") as f:
                self.registry = pickle.load(f)
            print(f"저장된 강아지 {len(self.registry)}마리 불러옴: {list(self.registry.keys())}")

    def identify(self, crop_bgr, threshold=0.4):
        """등록된 강아지 중 가장 유사한 강아지 찾기"""
        if not self.registry:
            return None, 0.0

        feature = self.extract_feature(crop_bgr)

        best_name = None
        best_score = -1

        for name, reg_feature in self.registry.items():
            score = np.dot(feature, reg_feature)  # 코사인 유사도
            if score > best_score:
                best_score = score
                best_name = name

        if best_score >= threshold:
            return best_name, best_score
        return None, best_score
