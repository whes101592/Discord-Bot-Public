//#region 變數
const { MessageEmbed, GuildMember } = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
//#endregion

let ver = "21w41-Public-Patch"
let basedon = "21w41-Public" //請勿更改
let config_ver = 100 //請勿更改
let string_ver = 100 //請勿更改
let bot_ver = 100 //請勿更改

//#region 變數宣告區域
let err = ""
let check = ""
let consolechannel = ""
let config_json
let bot_json
let string_json
let config_json_cache
let bot_json_cache
let string_json_cache
//#endregion

//#region 初始化
fs.readFile('./Json/config.json', function (error, data) {
    if (error) {
        err = err + ":name_badge: Error: 5-1-001\n"
        E_error("Error: 5-1-001")
    } else {
        config_json = JSON.parse(data.toString());
        if (config_json["token"] != "") {
            if (config_json["console"] != "") {
                consolechannel = config_json["console"]
                cache()
                client.login(config_json["token"])
            } else {
                err = err + ":name_badge: Error: 5-2-001\n"
                E_error("Error: 5-2-001")
            }
        } else {
            err = err + ":name_badge: Error: 5-0-001\n"
            E_error("Error: 5-0-001")
        }
    }
})
//#endregion

//#region 初始化完成
client.on('ready', () => {
    if (err == "") {
        client.channels.cache.get(consolechannel).send(":white_check_mark: 機器人成功啟動 - " + ver);
    } else {
        client.channels.cache.get(consolechannel).send(":warning: 機器人已啟動 版本: " + ver + "\n:name_badge: 啟動過程拋出異常 試著使用 Reload 來定位錯誤");
    }
    console.log('\x1b[32m', `使用身份 ${client.user.tag} 登入 版本: ` + ver + "\n\n 如需更改代碼請創建分支或新增拉取請求並遵守 AGPL-3.0 開源協議\n\n GitHub: https://github.com/ExpTech-tw/Discord-Bot-Public", '\x1b[0m');
});
//#endregion

//#region 訊息處理區域
client.on('messageCreate', message => {

    //#region $ver
    if (message.content.startsWith("$ver")) {
        message.reply("版本: " + ver)
    }
    //#endregion

    //#region reload
    if (message.channel.id == consolechannel && (message.content == "reload" || message.content == "Reload" || message.content == "RELOAD")) {
        client.channels.cache.get(consolechannel).send(":white_check_mark: 正在重新加載配置文件 版本: " + ver);
        err = ""
        cache()
    }
    //#endregion

    //#region set
    if (message.channel.id == consolechannel && (message.content.startsWith("set") || message.content.startsWith("Set"))) {
        SET(message.content.replace("set ", "").replace("Set ", ""))
    }
    //#endregion

    //#region stop
    if (message.channel.id == consolechannel && (message.content == "stop" || message.content == "Stop" || message.content == "STOP")) {
        client.channels.cache.get(consolechannel).send(":warning: 正在準備結束進程... 版本: " + ver);
        client.channels.cache.get(consolechannel).send(":octagonal_sign: 機器人已關閉 - Warn: 1-3-001 版本: " + ver)
        console.log('\x1b[31m', "機器人已關閉 - Warn: 1-3-001 版本: " + ver, '\x1b[0m')
        setTimeout(function () { process.exit(1) }, 5000)
    }
    //#endregion

    //#region stop
    if ((message.channel.id == consolechannel && (message.content == "state" || message.content == "State")) || message.content == "$state") {
        if (err == "") {
            const exampleEmbed = new MessageEmbed()
                .setColor("#00EC00")
                .setTitle("完全正常運行")
                .setURL('')
                .setAuthor(client.user.tag, "", "")
                .setDescription(ver)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter(string_json["Embed_Information"] + " 基於: " + basedon, 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
            if (message.channel.id == consolechannel) {
                client.channels.cache.get(consolechannel).send({ embeds: [exampleEmbed] });
            } else {
                message.reply({ embeds: [exampleEmbed] })
            }
        } else {
            const exampleEmbed = new MessageEmbed()
                .setColor("#e5f53d")
                .setTitle("部份正常運行")
                .setURL('')
                .setAuthor(client.user.tag, "", "")
                .setDescription(ver + "\n" + err)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter(string_json["Embed_Information"] + " 基於: " + basedon, 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
            if (message.channel.id == consolechannel) {
                client.channels.cache.get(consolechannel).send({ embeds: [exampleEmbed] });
            } else {
                message.reply({ embeds: [exampleEmbed] })
            }
        }
    }
    //#endregion



});
//#endregion

//#region 頻道創建
client.on("channelCreate", channel => {
    if (bot_json["Channel_Adjustment_Notification_State"] != false) {
        if (err.includes("1-2-002") == true) {
            client.channels.cache.get(consolechannel).send(":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
        }
        let type
        if (channel.type == "GUILD_TEXT") {
            type = string_json["GUILD_TEXT"]
        } else if (channel.type == "GUILD_NEWS") {
            type = string_json["GUILD_NEWS"]
        } else if (channel.type == "GUILD_STAGE_VOICE") {
            type = string_json["GUILD_STAGE_VOICE"]
        } else {
            type = string_json["GUILD_VOICE"]
        }
        const exampleEmbed = new MessageEmbed()
            .setColor(bot_json["Channel_Adjustment_Notification_SET"][0]["ChannelCreate_Colour"])
            .setTitle(type)
            .setURL('')
            .setAuthor(channel.guild.name, "", "")
            .setDescription("# " + channel.name)
            .setThumbnail(channel.guild.iconURL())
            .setTimestamp()
            .setFooter(string_json["Embed_Information"] + ver, 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
        client.channels.cache.get(bot_json["Channel_Adjustment_Notification"]).send({ embeds: [exampleEmbed] });
    }
})
//#endregion

//#region 頻道刪除
client.on("channelDelete", channel => {
    if (bot_json["Channel_Adjustment_Notification_State"] != false) {
        if (err.includes("1-2-002") == true) {
            client.channels.cache.get(consolechannel).send(":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
        }
        let type
        if (channel.type == "GUILD_TEXT") {
            type = string_json["DELETE_GUILD_TEXT"]
        } else if (channel.type == "GUILD_NEWS") {
            type = string_json["DELETE_GUILD_NEWS"]
        } else if (channel.type == "GUILD_STAGE_VOICE") {
            type = string_json["DELETE_GUILD_STAGE_VOICE"]
        } else {
            type = string_json["DELETE_GUILD_VOICE"]
        }
        const exampleEmbed = new MessageEmbed()
            .setColor(bot_json["Channel_Adjustment_Notification_SET"][0]["ChannelDelete_Colour"])
            .setTitle(type)
            .setURL('')
            .setAuthor(channel.guild.name, "", "")
            .setDescription("# " + channel.name)
            .setThumbnail(channel.guild.iconURL())
            .setTimestamp()
            .setFooter(string_json["Embed_Information"] + ver, 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
        client.channels.cache.get(bot_json["Channel_Adjustment_Notification"]).send({ embeds: [exampleEmbed] });
    }
})
//#endregion

//#region 錯誤輸出調用
function E_error(error) {
    if (check == "") {
        console.log('\x1b[31m', error.replace(":name_badge: ", "") + " 版本: " + ver, '\x1b[0m')
    } else {
        client.channels.cache.get(consolechannel).send(error + " 版本: " + ver)
    }
}
//#endregion

//#region 檔案讀取
function cache() {
    fs.readFile('./Json/string.json', function (error, data) {
        if (error) {
            err = err + ":name_badge: Error: 5-1-002\n"
            E_error(":name_badge: Error: 5-1-002")
        } else {
            string_json = JSON.parse(data.toString());
            if (check != "") client.channels.cache.get(consolechannel).send(":white_check_mark: string.json 加載成功");
        }
        fs.readFile('./Json/bot.json', function (error, data) {
            if (error) {
                err = err + ":name_badge: Error: 5-1-003\n"
                E_error(":name_badge: Error: 5-1-003")
            } else {
                bot_json = JSON.parse(data.toString());
                if (check != "") client.channels.cache.get(consolechannel).send(":placard: Channel_Adjustment_Notification_State [" + bot_json["Channel_Adjustment_Notification_State"] + "]");
                if (check != "") client.channels.cache.get(consolechannel).send(":placard: Channel_Adjustment_Notification [" + bot_json["Channel_Adjustment_Notification"] + "]");

                if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
                    err = err + ":name_badge: Error: 1-2-002\n"
                    E_error(":name_badge: Error: 1-2-002");

                } else {
                    if (check != "") client.channels.cache.get(consolechannel).send(":white_check_mark: bot.json 加載成功");
                }
            }
            fs.readFile('./Json/config.json', function (error, data) {
                if (error) {
                    err = err + ":name_badge: Error: 5-1-001\n"
                    E_error(":name_badge: Error: 5-1-001")
                } else {
                    config_json = JSON.parse(data.toString());
                    if (check != "") client.channels.cache.get(consolechannel).send(":white_check_mark: config.json 加載成功");
                }
                if (err == "") {
                    if (check != "") client.channels.cache.get(consolechannel).send(":white_check_mark: 配置文件加載成功 版本: " + ver);
                } else {
                    if (check != "") client.channels.cache.get(consolechannel).send(":warning: 配置文件加載完畢 版本: " + ver + "\n:name_badge: 加載過程拋出異常 試著根據 錯誤碼 來定位並修復錯誤");
                }
                if (check == "") check = "1"
            })
        })
    })
}
//#endregion

//#region set
function SET(x) {
    bot_json_cache=bot_json
    config_json_cache=config_json
    string_json_cache=string_json
    x = x.split(" ")
    if (x[0] == "Channel_Adjustment_Notification_State") {
        if (x[1] == "true") {
            bot_json_cache["Channel_Adjustment_Notification_State"] = true
            client.channels.cache.get(consolechannel).send(":white_check_mark: Channel_Adjustment_Notification_State 已成功設定為 [true]\n:warning: 使用 Reload 來套用新設定");
        } else if (x[1] == "false") {
            bot_json_cache["Channel_Adjustment_Notification_State"] = false
            client.channels.cache.get(consolechannel).send(":white_check_mark: Channel_Adjustment_Notification_State 已成功設定為 [false]\n:warning: 使用 Reload 來套用新設定");
        } else {
            client.channels.cache.get(consolechannel).send(":warning: 未知的附屬指令");
        }
    } else if (x[0] == "Channel_Adjustment_Notification") {
        if (Number.isInteger(Number(x[1])) == true) {
            bot_json_cache["Channel_Adjustment_Notification"] = Number(x[1])
            client.channels.cache.get(consolechannel).send(":white_check_mark: Channel_Adjustment_Notification 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來套用新設定");

        } else if (x[1] == "clear") {
            bot_json_cache["Channel_Adjustment_Notification"] = "Channel_ID"
            bot_json_cache["Channel_Adjustment_Notification_State"] = false
            client.channels.cache.get(consolechannel).send(":white_check_mark: Channel_Adjustment_Notification 已成功清除\n:warning: 已關閉 Channel_Adjustment_Notification 功能\n:warning: 使用 Reload 來套用新設定");
        } else {
            client.channels.cache.get(consolechannel).send(":warning: 未知的附屬指令");
        }
    } else {
        client.channels.cache.get(consolechannel).send(":warning: 未知的指令");
    }
    fs.writeFile('./Json/string.json', JSON.stringify(string_json_cache), function () {
    })
    fs.writeFile('./Json/config.json', JSON.stringify(config_json_cache), function () {
    })
    fs.writeFile('./Json/bot.json', JSON.stringify(bot_json_cache), function () {
    })
}
//#endregion









