# ExpTech 探索科技 GitHub
<img alt="Discord" src="https://img.shields.io/discord/857181425908318218">
編程、設計、創意、實用
<br>
努力成為真正的高手
<br />
<p align="center">
  <a href="https://github.com/ExpTech-tw/Example/">
    <img src="image/ExpTech.png" alt="ExpTech" width="150" height="150">
  </a>
  <h3 align="center">ExpTech</h3>
  <p align="center">
    ! 用科技創造無限可能 !
    <br />
    ·
    <a href="https://github.com/ExpTech-tw/Example/issues">錯誤回報</a>
    ·
  </p>
</p>

## 項目概要
* Discord-Bot-Public 公版機器人架構
* 每周五發布新版本
* 追求穩定可使用基於 原始碼 開發位於 (Release) 區域之已發布版本
* 不推薦使用 Code區域 原始碼創建機器人
* 如需更改代碼請創建分支或新增拉取請求並遵守 AGPL-3.0 開源協議
* Discord (https://discord.gg/TtvkHwy97f)

## 現有功能
* 創建頻道通知
* 刪除頻道通知
* 聊天記錄功能
* 聊天翻譯功能
* 熱加載數據
* 錯誤碼定位錯誤

## 環境要求
* Node.js - V 16.10.0
* npm - V 7.24.0
* discord.js - V 13.2.0

### 建立環境
* 下載 機器人 核心代碼 index.js檔案 載點: (https://github.com/ExpTech-tw/Discord-Bot-Public/releases)
* 將 檔案 放到桌面資料夾
* 使用 Windows+R 打開 CMD 視窗
* 使用下方指令檢查是否有安裝 Node
```console 
node -v
```
* 指令執行後的正確結果 (若非正確結果請安裝 Node)
```
v16.10.0
```
* Windows Node V 16.10.0 載點: (https://nodejs.org/dist/v16.10.0/node-v16.10.0-x64.msi)
* 確認安裝 Node 之後 CD 到 index.js 的目錄下 (請使用自己的路徑)
```console 
#範例 (請根據自己的實際路徑更改 CD 位置)
cd C:\Users\Desktop\Discord-Bot-Public\
```
* Node.js 模組
```console
npm install axios
npm i node-fetch@1.7.3
```
* 啟動機器人
```console 
node index.js
```

## 配置文件 - Config.json
```
{
 "token":"", //你的機器人 Token
 "console":"", //你的 console 頻道ID
 "API_URL":"http://exptech.mywire.org:1015/", //API URL
 "API_KEY":"" //API 密鑰
}
```

## 進階設定 - Bot.json
```
{
    "URL_Security_Verification": true, //網址安全檢查功能
    "Translate_State": false, 啟用或關閉 翻譯功能
    "Translate_Repeat_Tag": true, //啟用或關閉 翻譯時重複 Tag
    "Translate_en": "Channel_ID", //英文 頻道ID
    "Translate_zh_TW": "Channel_ID", //中文 頻道ID
    "ChatRecorder_State": false, //啟用或關閉 聊天記錄器
    "ChatRecorder": "Channel_ID", //聊天記錄器 頻道ID
    "Channel_Adjustment_Notification_State": false, //啟用或關閉 創建和刪除頻道通知
    "Channel_Adjustment_Notification": "Channel_ID", //通知發送 頻道ID
    "Channel_Adjustment_Notification_SET": [ //進階設定
        {
            "ChannelCreate_Colour": "#00EC00", //創建頻道 嵌入框 顏色
            "ChannelDelete_Colour": "#E60000" //刪除頻道 嵌入框 顏色
        }
    ]
}
```

## 字串文件 - String.json
```
{
    "Embed_Information":"Discord-Bot-Public 公版架構 ",
    "GUILD_TEXT":"文字頻道 已建立",
    "GUILD_VOICE":"語音頻道 已建立",
    "GUILD_NEWS":"公告頻道 已建立",
    "GUILD_STAGE_VOICE":"舞台頻道 已建立",
    "DELETE_GUILD_TEXT":"文字頻道 已刪除",
    "DELETE_GUILD_VOICE":"語音頻道 已刪除",
    "DELETE_GUILD_NEWS":"公告頻道 已刪除",
    "DELETE_GUILD_STAGE_VOICE":"舞台頻道 已刪除"
}
```

## 貢獻者
* whes1015 - 程式開發
* 
* 炸蝦好吃 - 協助校正
* smile - 協助校正
