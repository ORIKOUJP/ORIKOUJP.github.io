# Design R — 開発引継ぎ資料

**最終更新**: 2026-06-01  
**作成者**: Claude（前セッションより引継ぎ）  
**次のClaudeへ**: このファイルを読むだけで開発を継続できます。

---

## 1. プロジェクト概要

### 何を作っているか
**Design R** は、個人事業主・小規模店舗向けの「開業・集客サポートサービス」の公式Webサイト。

「ホームページ制作会社のサイト」ではなく、  
**「相談しやすい個人の開業サポーター」** として見せることが最大のコンセプト。

### 運営者情報
- **サービス名**: Design R（仮称 — 変更しやすい構造にしてある）
- **拠点**: 大阪
- **連絡先**: orikou.jp@gmail.com
- **LINE**: https://lin.ee/o1Tl4J2
- **Instagram**: 未設定（`instagram.com/XXXXXXX` がプレースホルダー）

### アクセス情報
| 項目 | 内容 |
|---|---|
| 公開URL | https://orikoujp.github.io/ |
| GitHubリポジトリ | https://github.com/ORIKOUJP/ORIKOUJP.github.io |
| ローカルパス | ~/Desktop/rdesign/ |
| ホスティング | GitHub Pages（mainブランチのルートを公開） |
| フォームサービス | Formspree（https://formspree.io/f/xbdbvowv） |

---

## 2. 現在の仕様

### 技術スタック
- **HTML / CSS / JavaScript のみ**（フレームワーク・ビルドツール一切なし）
- **レスポンシブ**: モバイルファースト設計
- **フォント**: Inter + Noto Sans JP（Google Fonts）
- **アニメーション**: Intersection Observer API（スクロールフェードイン）

### ページ構成（上から順）

| セクション | ID | 内容 |
|---|---|---|
| ヘッダー | `#header` | スティッキー。PC用ナビ＋スマホハンバーガー |
| ヒーロー | `#top` | メインコピー・CTAボタン・特徴タグ・モックアップ |
| お悩み | `#pain` | 6項目のチェックリスト＋「必要なものだけご提案」 |
| サービス | `#services` | 4サービスカード（HP・Google・LINE・Instagram）|
| 料金 | `#pricing` | 3プラン＋単品オプション一覧 |
| 見積もり | `#estimate` | チェック式セルフ見積もり（JS・パック自動判定） |
| 運営者 | `#about` | 写真＋本文＋特徴タグ＋CTA |
| 制作事例 | `#works` | 3事例カード（現在はプレースホルダー） |
| お問い合わせ | `#contact` | LINE・InstagramDMボタン＋Formspreeフォーム |
| フッター | — | ナビ＋コピーライト（年は自動更新） |

### お問い合わせフォーム
- **Formspree** 設定済み（action属性にURL記入済み）
- 送信先: `orikou.jp@gmail.com`
- 件名: `[Design R] ホームページ制作お問い合わせ`
- hidden フィールド: `_subject` 設定済み

### セルフ見積もり ロジック（js/main.js）
チェックボックスを選択した瞬間に結果をリアルタイム表示。

```
【パック判定の優先順位】
① hp + google + line + instagram が全選択
    → 開業スタートパック（¥39,800）＋ 残りを個別加算

② google + line + instagram が全選択（hpなし）
    → 集客スタートパック（¥24,800）＋ 残りを個別加算

③ 上記に該当しない
    → 選択された単品の合計を表示

【節約額の計算】
  パックの場合: 単品合計 - パック価格 = 節約額 として表示
```

---

## 3. 料金体系

### パックプラン
| プラン名 | 金額（税込） | 内容 |
|---|---|---|
| HP制作プラン | ¥19,800 | HP制作のみ（トップ+下層3P+フォーム+スマホ対応） |
| 開業スタートパック | ¥39,800 | HP制作＋Google＋LINE＋Instagram整備 |
| 集客スタートパック | ¥24,800 | Google＋LINE＋Instagram整備（HP除く） |

### 単品・オプション
| サービス | 金額 |
|---|---|
| ホームページ制作 | ¥19,800〜 |
| Googleマップ登録サポート | ¥5,000 |
| LINE公式アカウント構築 | ¥10,000 |
| Instagramプロフィール整備 | ¥10,000 |
| Instagram投稿作成（10本） | ¥9,800 |
| LINEリッチメニュー作成 | ¥5,000 |
| 画像制作 | ¥2,000〜 |
| 保守・更新代行 | 要相談 |

---

## 4. 決定済みデザイン

### カラー（CSS変数 `--clr-accent` を1か所変えれば全体に反映）
| 変数名 | 値 | 用途 |
|---|---|---|
| `--clr-accent` | `#4F46E5` | メインアクセント（インディゴ） |
| `--clr-accent-hover` | `#4338CA` | ホバー時 |
| `--clr-accent-light` | `#EEF2FF` | 薄い背景・バッジ |
| `--clr-bg` | `#FFFFFF` | 白ベース |
| `--clr-text` | `#0F172A` | メインテキスト |

### デザイン方針（変えてはいけない）
- **AI感のある装飾は一切使わない**（✦・✨・グラデーション過多など）
- 「格安HP制作屋」ではなく「**相談しやすい個人の開業サポーター**」の印象を維持
- 記号は `✓` `→` `・` `📍` `💬` `📸` など親しみやすいものを使用

### コピーの方針
- NG: 「AI活用」「AI制作」「最先端」
- OK: 「個人事業主向け」「買い切り」「最短対応」「相談ベース」「まとめてサポート」
- メインコピー（変更禁止）: **「開業に必要なWeb周り、まとめてお任せください。」**

---

## 5. 未実装・プレースホルダー一覧

現在、以下は**仮の状態**。実際のコンテンツへの差し替えが必要。

| 項目 | 場所 | 差し替え方法 |
|---|---|---|
| 運営者プロフィール写真 | `#about` 左側の「R」円 | `images/profile.jpg`（400×400px推奨）を用意し、HTML内のコメントに沿って差し替え |
| 制作事例 画像3枚 | `#works` 各カード | `images/work-01.jpg` `work-02.jpg` `work-03.jpg` に差し替え。HTML内にコメントあり |
| OGP画像 | `<head>` | `images/ogp.png`（1200×630px）を用意し、head内のコメントを外す |
| ファビコン | `<head>` | `images/favicon.ico` を用意し、link要素を差し替え |
| Instagram URL | `#contact` / `#hero` | `instagram.com/XXXXXXX` を実際のURLに変更 |
| Formspreeメール認証 | Formspree管理画面 | `orikou.jp@gmail.com` 宛の確認メールを承認（未確認の場合は初回送信が届かない） |

---

## 6. 今後やること

### 優先度：高
- [ ] プロフィール写真を撮って差し替え
- [ ] Instagramアカウント作成・URL差し替え
- [ ] Formspreeのメール認証確認（届いているかチェック）
- [ ] 実際の制作事例が出たら画像差し替え

### 優先度：中
- [ ] OGP画像作成（SNSシェア時の見た目改善）
- [ ] 独自ドメイン取得（例: rdesign.jp）→ GitHubのSettings > Pages > Custom domainで設定
- [ ] `git config --global user.name "Your Name"` と `user.email` を設定（コミット情報の整理）

### 優先度：低
- [ ] Google Analytics設置（アクセス解析）
- [ ] お問い合わせ完了ページ作成（Formspreeの `_next` 設定）
- [ ] 事例が増えたらWorksセクションを拡充

---

## 7. フォルダ構成

```
~/Desktop/rdesign/
├── CLAUDE.md          ← この引継ぎ資料
├── index.html         ← メインページ（全セクション含む・約690行）
├── css/
│   └── style.css      ← スタイルシート（約2075行）
├── js/
│   └── main.js        ← JavaScript（約235行）
└── images/            ← 画像フォルダ（現在空）
    ├── profile.jpg    【未設置】運営者写真（400×400px）
    ├── work-01.jpg    【未設置】事例1（Beauty Nail）
    ├── work-02.jpg    【未設置】事例2（Personal Gym Rise）
    ├── work-03.jpg    【未設置】事例3（Cafe Terrace）
    ├── ogp.png        【未設置】SNSシェア用（1200×630px）
    └── favicon.ico    【未設置】ファビコン
```

### CSS構成（style.css）
1. CSS変数（テーマ・カラー設定）
2. リセット・ベーススタイル
3. ユーティリティ（コンテナ・セクション共通）
4. ボタン
5. ヘッダー
6. ヒーロー
7. お悩みセクション（pain）
8. サービスカード
9. 料金カード
10. 制作事例カード
11. お問い合わせ
12. フッター
13. アニメーション
14. レスポンシブ
15. 料金オプション単品（追加）
16. セルフ見積もり（estimate）
17. 運営者紹介（about）

### JS構成（main.js）
1. ヘッダーのスクロール制御
2. ハンバーガーメニュー
3. スクロールアニメーション（Intersection Observer）
4. スムーズスクロール（ヘッダー高さ補正）
5. スマホナビのタップ閉じ
6. フッター年号の自動更新
7. セルフ見積もり（パック自動判定・リアルタイム表示）

---

## 8. GitHubへのpush手順

### 認証トークン（PAT）
PATトークンはセキュリティのためここには記載しません。  
⚠️ **有効期限: 2026年7月1日頃**（作成時に30日を選択）  
期限切れ・紛失の場合は https://github.com/settings/tokens で新しいトークンを発行してください。

### push手順
```bash
cd ~/Desktop/rdesign

# 変更をコミット
git add .
git commit -m "変更内容"

# pushする（トークンをURLに含める）
git remote set-url origin https://ORIKOUJP:【トークン】@github.com/ORIKOUJP/ORIKOUJP.github.io.git
git push origin main

# push完了後はトークンをURLから除去（セキュリティ）
git remote set-url origin https://github.com/ORIKOUJP/ORIKOUJP.github.io.git
```

### 反映タイミング
push後 **1〜2分** でサイトに反映される（GitHub Pagesの自動デプロイ）。

---

## 9. 注意事項

### 絶対に守ること
1. **mainブランチへの直pushは禁止**（このプロジェクトはシンプルなため例外的に直push運用中。ただし通常プロジェクトは feature ブランチを切ること）
2. **PATトークンはコードに書かない**（push時のみURLに含め、完了後すぐに除去する）
3. **AIっぽい表現・装飾は追加しない**（✦・✨など。デザイン方針参照）
4. **料金の変更は慎重に**（セルフ見積もりのJSロジックとHTMLの両方を合わせて変更すること）

### セルフ見積もりを修正するとき
`js/main.js` の以下2か所を必ず合わせて変更する：

```javascript
// ① 単価定義（EST_ITEMS オブジェクト）
const EST_ITEMS = {
  hp: { name: '...', price: 19800 },
  // ...
};

// ② パック定義（EST_PACKS 配列）
const EST_PACKS = [
  { id: 'startup', name: '開業スタートパック', price: 39800, requires: ['hp','google','line','instagram'] },
  { id: 'collection', name: '集客スタートパック', price: 24800, requires: ['google','line','instagram'] },
];
```

HTMLのチェックボックスの `value` 属性も `EST_ITEMS` のキーと一致している必要がある。

### サイト名を変更する場合
`index.html` 内で `Design R` を全検索・置換する（6〜8か所）。  
CSSや JSには文字列として埋め込まれていないので変更不要。

### カラーを変更する場合
`css/style.css` の冒頭の `:root` 内にある `--clr-accent` の値を1か所変えるだけで全体に反映される。

---

## 10. コミット履歴

| ハッシュ | 内容 |
|---|---|
| `65de4dd` | 開業診断削除・運営者紹介追加・ヒーロー改行修正 |
| `409fd7c` | 大幅改修: 開業診断・セルフ見積もり追加、AI感除去 |
| `17c830a` | Formspree連携設定 |
| `296b90d` | 7項目修正（LINE差し替え・AI削除・コピー刷新など）|
| `e252bd4` | Initial commit |

---

*このドキュメントは ~/Desktop/rdesign/CLAUDE.md に保存されています。*
