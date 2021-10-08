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
* 追求穩定可使用基於 Code區域 原始碼開發位於 (Tag) 區域之已發布版本
* 不推薦使用 Code區域 原始碼創建機器人
* 如需更改代碼請創建分支或新增拉取請求並遵守 AGPL-3.0 開源協議

## 環境要求
* Node.js - V 16.10.0
* npm - V 7.24.0
* discord.js - V 13.2.0
### Node.js 模組
*

## 配置文件 - Config.json
```
{
 "token":"", //你的機器人 Token
 "console":"" //你的 console 頻道ID
}
```

## 進階設定 - Bot.json
```
{

    "Channel_Adjustment_Notification_State": false, //是否啟用創建或刪除頻道通知
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
