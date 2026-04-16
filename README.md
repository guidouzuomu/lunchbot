# lunchbot

## 概要

/lunch /ramenとコマンドを打つことで会津若松市内の飲食店、ラーメン店をランダムにピックアップしgooglemaoのリンク付きの店名を返すbotです。

## 環境構築

.envファイルに以下を設定してください

```
DISCORD_TOKEN=YOUR_DISCORD_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

設定後、以下のコマンドで設定したチャンネルでbotが稼働します

```
npm run start
```
