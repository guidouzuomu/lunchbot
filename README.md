
# Lunch Bot 🍜

## 概要

`/lunch` または `/ramen` コマンドを実行することで、会津若松市内の飲食店・ラーメン店をランダムにピックアップし、Googleマップのリンク付きで提案してくれるDiscord Botです。

- 会津若松市内の美味しいお店を探せます。
- **キャッシュ機能（API節約）**: 1度検索するとAPIから取得した20件のデータを10分間メモリに保持します。連続でコマンドを使ってもAPIを無駄に叩かず、キャッシュからサクサク次のお店を提案（ガチャ）してくれます！

## 環境構築

### 前提条件

- Node.js がインストールされていること

### 1. パッケージのインストール

プロジェクトのディレクトリで以下のコマンドを実行し、必要なパッケージをインストールしてください。

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、以下を設定してください。

**コード スニペット**

```
DISCORD_TOKEN=YOUR_DISCORD_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

### 3. スラッシュコマンドの登録

Discordサーバーにコマンドを認識させるため、初回のみ以下のコマンドを実行します。

**Bash**

```
node deploy-commands.js
```

### 4. 起動

以下のコマンドでBotが稼働します。

**Bash**

```
npm run start
```
