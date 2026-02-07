# My Dashboard

Vpassのクレカ利用通知メールを自動解析し、月々の支出を見える化する個人向け家計ダッシュボードです。

## 機能

- **クレカ利用履歴** — Vpassからのメールを自動取得・一覧表示
- **カテゴリ別集計** — 利用先ごとにカテゴリを設定し、カテゴリ別の支出を表示
- **支払い見込み** — 固定費（サブスク・固定費）+ 変動費（クレカ実績）で今月の支払い見込みを表示
- **サブスク・固定費管理** — 月額/年額の支払いを一覧管理、年1回の支払いは該当月のみ表示
- **予算管理** — カテゴリ別の予算と実績を比較
- **予定・タスク** — Googleカレンダー連携、簡易タスク管理

## 構成

```
dashboard/
├── gas/api.gs       ← バックエンド（Google Apps Script）
├── src/             ← フロントエンド（Vue.js）
│   ├── pages/       ← 画面
│   ├── components/  ← UIパーツ
│   └── utils/       ← API通信
└── dist/            ← ビルド成果物
```

## 技術スタック

- **フロントエンド:** Vue.js 3 / Vue Router / Vite
- **バックエンド:** Google Apps Script
- **データ:** Google Spreadsheet（DB代わり）
- **メール解析:** Gmail API（Vpass通知メール）
- **ホスティング:** GitHub Pages

## セットアップ

### 1. バックエンド（GAS）

1. Googleスプレッドシートを新規作成
2. 拡張機能 > Apps Script を開く
3. `gas/api.gs` の内容を貼り付け
4. `SPREADSHEET_ID` を自分のスプレッドシートのURLに書き換え
5. `onOpen()` を一度実行（シートが自動作成される）
6. デプロイ > 新しいデプロイ > ウェブアプリ（全員アクセス可）

### 2. フロントエンド

```bash
npm install
npm run dev
```

ブラウザでダッシュボードを開き、API設定ボタンからデプロイしたGASのURLを入力してください。

### 3. ビルド・公開

```bash
npm run build
```

`dist/` フォルダをGitHub Pagesなどでホスティングしてください。

## スプレッドシートのシート構成

| シート名 | 用途 |
|---|---|
| VpassUsage | クレカ利用履歴（メールから自動取得） |
| MerchantMap | 利用先 → カテゴリのマッピング |
| Subscriptions | サブスク・固定費・借金の管理 |
| Budgets | カテゴリ別予算 |
| Todos | タスク管理 |
