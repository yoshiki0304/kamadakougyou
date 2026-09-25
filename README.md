# 鎌田工業株式会社 Web Site

GitHub Pages向けの静的サイトです。

## ページ
- `index.html` — トップページ
- `company.html` — 会社概要
- `services.html` — 事業・サービス紹介
- `contact.html` — お問い合わせ
- `karaoke.html` — 大樹悟朗のファンサイト

## デザイン
- メインカラー：明るい水色
- サブカラー：黄色
- 社名をロゴ代わりにしたテキストブランド
- スクロールリビール、パララックス、横スクロール文字、ページ上部の進捗バー等を実装
- PC / タブレット / スマートフォン対応

## 写真
大樹悟朗ファンサイトの4枚はユーザー提供画像を `assets/img/` に格納しています。
解体現場の写真はUnsplashの公開画像を外部URLで表示しています。実際の施工写真が用意できた場合は差し替えを推奨します。

## GitHub Pages
Repository > Settings > Pages > Source で `Deploy from a branch` を選択し、公開対象ブランチ（通常 `main`）と `/ (root)` を選択して保存してください。

## 2026-09-24 視認性・余白修正
- 「事業・サービス」直下の大きな空白を解消
- JS読込が遅れても主要コンテンツが消えないよう表示方式を改善
- 水色グラデーション上の文字に黄色・白のアクセントを追加
- 見出し、説明文、サービスカードのコントラストを強化

## TOPメインビジュアル動画
- `assets/video/kamada-top-pc.mp4`：PC用
- `assets/video/kamada-top-mobile.mp4`：スマートフォン向け軽量版
- `assets/video/kamada-top-poster.webp` / `.jpg`：読み込み前・動画非対応時の代替画像

自動再生・ミュート・ループ・インライン再生に設定し、画面右下の `PAUSE / PLAY` で停止・再生できます。


## TOP動画（PC / スマホ）
- PC（768px以上）: `assets/video/kamada-top-pc.mp4`（1920×1080）
- スマホ（767px以下）: `assets/video/kamada-top-mobile.mp4`（720×1280）
- スマホ用フォールバック画像: `assets/video/kamada-top-poster-mobile.webp`
- `autoplay muted loop playsinline` を設定済みです。
- スマホでは縦型動画に合わせてメインビジュアルを9:16で表示します。

## TOP動画の切り替え
- 画面幅768px以上: `assets/video/kamada-top-pc.mp4`
- 画面幅767px以下: `assets/video/kamada-top-mobile-v2.mp4`
- JavaScriptで動画の`src`を明示的に切り替えるため、スマートフォンでもPC版動画が残る問題を回避しています。

## スマートフォン用TOP動画（2026-09-25修正版）
スマートフォンでは、ユーザー提供の `kamada-top-video-webset-complete.zip` 内にある
1080×1920版をそのまま `assets/video/kamada-top-mobile-exact-20260925.mp4` として使用しています。
PC用動画とは別の `<video>` 要素で実装しており、767px以下ではスマートフォン用だけを表示します。
