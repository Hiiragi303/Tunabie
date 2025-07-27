# 🌱 Tunabie - ゴミの分別支援Bot　"ゴミわけるくん"

サポーターズ主催ハッカソンで制作した、**ゴミの分別をサポートするLINE Bot**です。  
GAS（Google Apps Script）とGemini APIを活用し、ユーザーが送った画像やテキストから**ごみの種類や分別方法**を判定します。

---

## 📌 概要

本プロジェクトは、**分別の手間を減らし、環境意識の向上**を目的としたLINE Botです。  
ユーザーが送った画像やテキストに対し、Botが以下のような分類情報を返します：

![](demo/images/imageResponse.png)

---

## 🔧 使用技術

| 技術 | 説明 |
|------|------|
| LINE Messaging API | Botとのメッセージ送受信 |
| Google Apps Script | バックエンド処理、スプレッドシート連携 |
| Gemini API | AIによる画像・テキスト解析 |
| Google スプレッドシート | 分別ログの保存・可視化/ゴミに関する情報保存|

---

## 📷 使い方

1. LINEでBotを友達追加
2. ごみに関する画像 or テキストを送信
3. Botが分別情報を返信！

---

## 🎨 特徴

- ✅ Gemini API による柔軟な自然言語・画像解析
- ✅ GAS によるサーバーレスな軽量実装
- ✅ スプレッドシートへのログ記録
- ✅ キャラクター「ゴミわけるくん」による親しみやすい体験

---

## 👶 キャラクター：ゴミわけるくん

- 名前：ゴミわけるくん  
- 出身：エコ星  
- 年齢：1歳  
- 趣味：ゴミの分別、きれいな景色を眺めること  
- 特徴：怒ると語尾が「**えっぴ**」になる  
- セリフ例：「それ無駄えっぴ！」

---

## 📁 フォルダ構成（例）
├── Code.gs # メイン処理（doPost）
├── Reply.gs # Lineへの返信処理
├── Gemini.gs # GeminiAPIの処理
├── SheetManager.gs # スプレッドシートの操作処理
├── Prompt.gs # プロンプトの定義
├── Parse.gs # JSONのパース処理
├── TrashDetecter.gs # 画像からゴミの検出処理
├── ClassPredicter.gs # ゴミの分類の判定処理
├── demo
    └── images
          └── imageResponse.png
└── README.md # このファイル
