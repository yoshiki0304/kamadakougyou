# 鎌田工業株式会社 Webサイト

GitHub Pages等の静的ホスティングで公開できる5ページ構成のWebサイトです。

## ページ
- `index.html` - トップページ
- `company.html` - 会社概要
- `services.html` - 事業・サービス紹介
- `contact.html` - お問い合わせ
- `karaoke.html` - 大樹悟朗のカラオケファンの皆様へ

## 公開方法（GitHub Pages）
1. GitHubで新規リポジトリを作成
2. このフォルダ内のファイルをそのままアップロード
3. GitHubの `Settings` → `Pages`
4. `Build and deployment` の Source を `Deploy from a branch` に設定
5. Branch を `main`、Folder を `/(root)` にして保存

## お問い合わせフォーム
静的サイト用に、入力内容から `mailto:` を生成して端末のメールソフトを開く方式です。
送信をWeb上で完結させたい場合は Formspree / Google Apps Script / 独自API等への差し替えが必要です。

## 編集箇所
- 色・レイアウト: `assets/css/style.css`
- メニュー・フォーム挙動: `assets/js/main.js`
- ロゴマーク: `assets/img/logo-mark.svg`
- TOPイラスト: `assets/img/hero-illustration.svg`
- カラオケページイラスト: `assets/img/karaoke-illustration.svg`
