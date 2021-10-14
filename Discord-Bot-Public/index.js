//#region 變數
const { MessageEmbed, GuildMember } = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const axios = require('axios')
const currentDate = new Date();
//#endregion

let ver = "21w42-Public-Beta"

let basedon = "21w42-Public" //請勿更改
let debug = "" //請勿更改

//#region 變數宣告區域
let config_path = "./Json/config.json"
let bot_path = "./Json/bot.json"
let string_path = "./Json/string.json"
let err = ""
let check = ""
let consolechannel = ""
let config_json
let bot_json
let string_json
let config_json_cache = ""
let bot_json_cache = ""
let string_json_cache = ""
let beta = ""
let x1
let y1
let z1
//#endregion

//#region 初始化
fs.readFile(config_path, function (error, data) {
    if (error) {
        err = err + ":name_badge: Error: 5-1-0002\n"
        E_error("Error: 5-3-0003", error)
    } else {
        config_json = JSON.parse(data.toString());
        if (config_json["token"] != "") {
            if (config_json["console"] != "") {
                consolechannel = config_json["console"]
                cache()
                client.login(config_json["token"])
            } else {
                err = err + ":name_badge: Error: 5-2-0005\n"
                E_error("Error: 5-1-0002")
            }
        } else {
            err = err + ":name_badge: Error: 5-0-0001\n"
            E_error("Error: 5-1-0001")
        }
    }
})
//#endregion

//#region 初始化完成
client.on('ready', () => {

    if (debug == "1") {
        C_send(consolechannel, ":closed_lock_with_key: 檢測到非正式版本 為確保數據安全已終止進程 - " + ver);
        console.log('\x1b[31m', "Warn: 5-2-0014 版本: " + ver, '\x1b[0m')
        C_send(consolechannel, ":octagonal_sign: Warn: 5-2-0014 版本: " + ver)
        STOP()
    } else {
        if (err == "") {
            C_send(consolechannel, ":white_check_mark: 機器人成功啟動 - " + ver);
        } else {
            C_send(consolechannel, ":warning: 機器人已啟動 版本: " + ver + "\n:name_badge: 啟動過程拋出異常 試著使用 Reload 來定位錯誤");
        }
        if (beta != "") C_send(consolechannel, ":satellite: 已啟用 Beta 功能 可能導致崩潰 請留意\n" + beta);
        console.log('\x1b[32m', `使用身份 ${client.user.tag} 登入 版本: ` + ver + "\n\n 如需更改代碼請創建分支或新增拉取請求並遵守 AGPL-3.0 開源協議\n\n GitHub: https://github.com/ExpTech-tw/Discord-Bot-Public", '\x1b[0m');
    }
});
//#endregion

//#region 訊息處理區域
client.on('messageCreate', message => {
    try {
        //guild.channels.get("895847483815624706").fetchMessage("896650808907673620").edit('New Content')
        if (bot_json["ChatRecorder"] == message.channel.id) return
        if (message.channel.id == consolechannel) {
            //#region reload
            if (message.content == "reload" || message.content == "Reload" || message.content == "RELOAD") {
                C_send(consolechannel, ":white_check_mark: 正在重新加載配置文件 版本: " + ver);
                err = ""
                cache(1)
            }
            //#endregion

            //#region set
            else if (message.content.startsWith("set") || message.content.startsWith("Set")) {
                SET(message.content.replace("set ", "").replace("Set ", ""))
            }
            //#endregion

            //#region stop
            if (message.content == "stop" || message.content == "Stop" || message.content == "STOP") {
                console.log('\x1b[31m', "Warn: 5-2-0008 版本: " + ver, '\x1b[0m')
                C_send(consolechannel, ":octagonal_sign: Warn: 5-2-0008 版本: " + ver)
                STOP()
            }
            //#endregion

        } else {

            //#region URL check
            if (bot_json["URL_Security_Verification"] == true && (message.content.includes("http") == true || message.content.includes("https") == true)) {
                if (config_json["API_URL"] != "" && config_json["API_KEY"] != "") {
                    axios
                        .post(config_json["API_URL"], 'API=' + config_json["API_KEY"] + '&&function=URL_Security_Verification&&value=' + message.content)
                        .then(res => {
                            if (res.data["response"] == "Safety") {
                                const exampleEmbed = new MessageEmbed()
                                    .setColor("#00EC00")
                                    .setTitle("網址檢測 ➝ 安全")
                                    .setURL('')
                                    .setAuthor(client.user.tag, "", "")
                                    .setDescription(ver)
                                    .setThumbnail(message.guild.iconURL())
                                    .setTimestamp()
                                    .setFooter("此服務由 ExpTech.tw 提供", 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
                                message.reply({ embeds: [exampleEmbed] })
                            } else {
                                const exampleEmbed = new MessageEmbed()
                                    .setColor("#E60000")
                                    .setTitle("網址檢測 ➝ 不安全")
                                    .setURL('')
                                    .setAuthor(client.user.tag, "", "")
                                    .setDescription(res.data["Type"])
                                    .setThumbnail(message.guild.iconURL())
                                    .setTimestamp()
                                    .setFooter("此服務由 ExpTech.tw 提供", 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');
                                message.reply({ embeds: [exampleEmbed] })
                                C_send(consolechannel, ":warning: 不安全網址\n用戶: " + message.author.username + "\n類型: " + res.data + "\n原文: " + message.content);
                            }
                        })
                        .catch(error => {
                            E_error(":name_badge: Error: 3-5-0016", error)
                        })
                } else {
                    E_error(":name_badge: Error: 3-5-0019", error)
                }
            }
            //#endregion

            //#region 聊天記錄
            if (bot_json["ChatRecorder_State"] == true) {
                if (err.includes("3-1-0007") == true) {
                    C_send(consolechannel, ":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
                }
                if (message.author.bot == true) return
                if (message.content.length >= 256) {
                    E_error(":name_badge: Error: 1-0-0018")
                    return
                }
                const exampleEmbed = new MessageEmbed()
                    .setColor("#00EC00")
                    .setTitle(message.channel.name)
                    .setURL('')
                    .setAuthor(message.author.username, "", "")
                    .setDescription(message.content)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(string_json["Embed_Information"] + " 基於: " + basedon, 'https://res.cloudinary.com/dpk8k0rob/image/upload/v1633698487/ExpTech_vjjh4b.jpg');

                C_send(bot_json["ChatRecorder"], { embeds: [exampleEmbed] });
            }
            //#endregion

            //#region 翻譯
            if (bot_json["Translate_State"] == true) {
                if (err.includes("3-1-0015") == true) {
                    C_send(consolechannel, ":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
                }
                if (message.author.bot == true) return
                if (bot_json["Translate_Repeat_Tag"] == false && message.content.includes("@") == true) return
                if (message.channel.id != bot_json["Translate_en"] && message.channel.id == bot_json["Translate_zh_TW"]) {
                    if (config_json["API_URL"] != "" && config_json["API_KEY"] != "") {
                        axios
                            .post(config_json["API_URL"], 'API=' + config_json["API_KEY"] + '&&function=translation-en&&value=' + message.content)
                            .then(res => {
                                C_send(bot_json["Translate_en"], message.author.username + " >> " + res.data["response"])
                            })
                            .catch(error => {
                                E_error(":name_badge: Error: 3-5-0016", error)
                            })
                    } else {
                        E_error(":name_badge: Error: 3-5-0019", error)
                    }
                }
                if (message.channel.id != bot_json["Translate_zh_TW"] && message.channel.id == bot_json["Translate_en"]) {
                    if (config_json["API_URL"] != "" && config_json["API_KEY"] != "") {
                        axios
                            .post(config_json["API_URL"], 'API=' + config_json["API_KEY"] + '&&function=translation-TW&&value=' + message.content)
                            .then(res => {
                                C_send(bot_json["Translate_zh_TW"], message.author.username + " >> " + res.data["response"])
                            })
                            .catch(error => {
                                E_error(":name_badge: Error: 3-5-0016", error)
                            })
                    } else {
                        E_error(":name_badge: Error: 3-5-0019", error)
                    }
                }
            }
            //#endregion

        }

        //#region state
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
                    C_send(consolechannel, { embeds: [exampleEmbed] });
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
                    C_send(consolechannel, { embeds: [exampleEmbed] });
                } else {
                    message.reply({ embeds: [exampleEmbed] })
                }
            }
        }
        //#endregion

    } catch (error) {
        if (message.channel.id == consolechannel) return
        err = err + ":name_badge: Error: 4-0-0013\n"
        E_error(":name_badge: Error: 4-0-0013", error)
    }
});
//#endregion

//#region STOP
function STOP() {
    C_send(consolechannel, ":warning: 正在準備結束進程... 版本: " + ver);
    C_send(consolechannel, ":octagonal_sign: 機器人已關閉 版本: " + ver)
    console.log('\x1b[31m', "機器人已關閉 版本: " + ver, '\x1b[0m')
    setTimeout(function () { process.exit(1) }, 2000)
}
//#endregion

//#region 頻道創建
client.on("channelCreate", channel => {
    try {
        if (bot_json["Channel_Adjustment_Notification_State"] != false) {
            if (err.includes("3-1-0006") == true) {
                C_send(consolechannel, ":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
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
            C_send(bot_json["Channel_Adjustment_Notification"], { embeds: [exampleEmbed] });
        }
    } catch (error) {
        err = err + ":name_badge: Error: 3-4-0012\n"
        E_error(":name_badge: Error: 3-4-0012", error)
    }
})
//#endregion

//#region 頻道刪除
client.on("channelDelete", channel => {
    try {
        if (bot_json["Channel_Adjustment_Notification_State"] != false) {
            if (err.includes("3-1-0006") == true) {
                C_send(consolechannel, ":warning: 似乎有哪些地方發生錯誤了 版本: " + ver + ":warning: 試著使用 Reload 來定位錯誤"); return
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
            C_send(bot_json["Channel_Adjustment_Notification"], { embeds: [exampleEmbed] });
        }
    } catch (error) {
        err = err + ":name_badge: Error: 3-4-0011\n"
        E_error(":name_badge: Error: 3-4-0011", error)
    }
})
//#endregion

//#region 指定頻道訊息
function C_send(id, msg) {
    try {
        client.channels.cache.get(id).send(msg);
    } catch (error) {
        E_error(":name_badge: Error: 2-0-0017", error)
    }
}
//#endregion

//#region 錯誤輸出調用
function E_error(error, info) {
    if (check == "") {
        console.log('\x1b[31m', error.replace(":name_badge: ", "") + " 版本: " + ver, '\x1b[0m')
    } else {
        client.channels.cache.get(consolechannel).send(error + " 版本: " + ver)
        if (info != "") client.channels.cache.get(consolechannel).send(":recycle: 錯誤詳情: " + info)
    }

}
//#endregion

//#region 檔案讀取
function cache(x) {
    try {
        if (x == 1) {
            x1 = string_json
            y1 = bot_json
            z1 = config_json
            string_json = string_json_cache
            bot_json = bot_json_cache
            config_json = config_json_cache
        }
        fs.readFile(string_path, function (error, data) {
            if (error) {
                err = err + ":name_badge: Error: 5-3-0004\n"
                E_error(":name_badge: Error: 5-3-0004", error)
            } else {
                if (x != 1) string_json = JSON.parse(data.toString());
                if (string_json_cache == "") string_json_cache = string_json
                if (check != "") C_send(consolechannel, ":white_check_mark: string.json 加載完畢");
            }
            fs.readFile(bot_path, function (error, data) {
                if (error) {
                    err = err + ":name_badge: Error: 5-3-0005\n"
                    E_error(":name_badge: Error: 5-3-0005", error)
                } else {
                    if (x != 1) bot_json = JSON.parse(data.toString());
                    if (bot_json_cache == "") bot_json_cache = bot_json
                    if (check != "") C_send(consolechannel, ":placard: Channel_Adjustment_Notification_State [" + bot_json["Channel_Adjustment_Notification_State"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: Channel_Adjustment_Notification [" + bot_json["Channel_Adjustment_Notification"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: ChatRecorder_State [" + bot_json["ChatRecorder_State"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: ChatRecorder [" + bot_json["ChatRecorder"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: Translate_State [" + bot_json["Translate_State"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: Translate_Repeat_Tag [" + bot_json["Translate_Repeat_Tag"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: Translate_en [" + bot_json["Translate_en"] + "]");
                    if (check != "") C_send(consolechannel, ":placard: Translate_zh_TW [" + bot_json["Translate_zh_TW"] + "]");



                    if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
                        err = err + ":name_badge: Error: 3-1-0006\n"
                        E_error(":name_badge: Error: 3-1-0006");
                    }
                    if (bot_json["ChatRecorder_State"] != false) {
                        beta = ":bulb: Beta-0001\n"
                        if (bot_json["ChatRecorder"] == "Channel_ID") {
                            err = err + ":name_badge: Error: 3-1-0007\n"
                            E_error(":name_badge: Error: 3-1-0007");
                        }
                    }
                    if (bot_json["Translate_State"] != false && (bot_json["Translate_zh_TW"] == "Channel_ID" || bot_json["Translate_en"] == "Channel_ID")) {
                        err = err + ":name_badge: Error: 3-1-0015\n"
                        E_error(":name_badge: Error: 3-1-0015");
                    }

                    if (check != "") C_send(consolechannel, ":white_check_mark: bot.json 加載完畢");

                }
                fs.readFile(config_path, function (error, data) {
                    if (error) {
                        err = err + ":name_badge: Error: 5-1-0002\n"
                        E_error(":name_badge: Error: 5-1-0002", error)
                    } else {
                        if (x != 1) config_json = JSON.parse(data.toString());
                        if (config_json_cache == "") config_json_cache = config_json
                        if (check != "") C_send(consolechannel, ":white_check_mark: config.json 加載完畢");
                    }
                    if (err == "") {
                        if (check != "") C_send(consolechannel, ":white_check_mark: 配置文件加載成功 版本: " + ver);
                        fs.writeFile(string_path, JSON.stringify(string_json_cache), function () {
                        })
                        fs.writeFile(config_path, JSON.stringify(config_json_cache), function () {
                        })
                        fs.writeFile(bot_path, JSON.stringify(bot_json_cache), function () {
                        })

                    } else {
                        if (check != "") C_send(consolechannel, ":warning: 配置文件加載完畢 版本: " + ver + "\n:name_badge: 加載過程拋出異常 試著根據 錯誤碼 來定位並修復錯誤" + "\n:name_badge: 本次更改將不會被保存至配置文件");
                        string_json = x1
                        bot_json = y1
                        config_json = z1
                    }
                    if (beta != "" && check != "") C_send(consolechannel, ":satellite: 已啟用 Beta 功能 可能導致崩潰 請留意\n" + beta);
                    if (check == "") check = "1"
                })
            })
        })
    } catch (error) {
        err = err + ":name_badge: Error: 4-4-0010\n"
        E_error(":name_badge: Error: 4-4-0010", error)
    }
}
//#endregion

//#region set
function SET(x) {
    try {
        x = x.split(" ")
        if (x[0] == "Channel_Adjustment_Notification_State") {
            if (x[1] == "true") {
                bot_json_cache["Channel_Adjustment_Notification_State"] = true
                C_send(consolechannel, ":white_check_mark: Channel_Adjustment_Notification_State 已成功設定為 [true]\n:warning: 使用 Reload 來套用新設定");
            } else if (x[1] == "false") {
                bot_json_cache["Channel_Adjustment_Notification_State"] = false
                C_send(consolechannel, ":white_check_mark: Channel_Adjustment_Notification_State 已成功設定為 [false]\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "Channel_Adjustment_Notification") {
            if (Number.isInteger(Number(x[1])) == true) {
                bot_json_cache["Channel_Adjustment_Notification"] = x[1]
                C_send(consolechannel, ":white_check_mark: Channel_Adjustment_Notification 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來套用新設定");

            } else if (x[1] == "clear") {
                bot_json_cache["Channel_Adjustment_Notification"] = "Channel_ID"
                bot_json_cache["Channel_Adjustment_Notification_State"] = false
                C_send(consolechannel, ":white_check_mark: Channel_Adjustment_Notification 已成功清除\n:warning: 已關閉 Channel_Adjustment_Notification 功能\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "ChatRecorder_State") {
            if (x[1] == "true") {
                bot_json_cache["ChatRecorder_State"] = true
                C_send(consolechannel, ":white_check_mark: ChatRecorder_State 已成功設定為 [true]\n:warning: 使用 Reload 來套用新設定");
            } else if (x[1] == "false") {
                bot_json_cache["ChatRecorder_State"] = false
                C_send(consolechannel, ":white_check_mark: ChatRecorder_State 已成功設定為 [false]\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "Translate_State") {
            if (x[1] == "true") {
                bot_json_cache["Translate_State"] = true
                C_send(consolechannel, ":white_check_mark: Translate_State 已成功設定為 [true]\n:warning: 使用 Reload 來套用新設定");
            } else if (x[1] == "false") {
                bot_json_cache["Translate_State"] = false
                C_send(consolechannel, ":white_check_mark: Translate_State 已成功設定為 [false]\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "ChatRecorder") {
            if (Number.isInteger(Number(x[1])) == true) {
                bot_json_cache["ChatRecorder"] = x[1]
                C_send(consolechannel, ":white_check_mark: ChatRecorder 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來套用新設定");

            } else if (x[1] == "clear") {
                bot_json_cache["ChatRecorder"] = "Channel_ID"
                bot_json_cache["ChatRecorder_State"] = false
                C_send(consolechannel, ":white_check_mark: ChatRecorder 已成功清除\n:warning: 已關閉 Channel_Adjustment_Notification 功能\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "Translate_en") {
            if (Number.isInteger(Number(x[1])) == true) {
                bot_json_cache["Translate_en"] = x[1]
                C_send(consolechannel, ":white_check_mark: Translate_en 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來套用新設定");

            } else if (x[1] == "clear") {
                bot_json_cache["Translate_en"] = "Channel_ID"
                bot_json_cache["Translate_en_State"] = false
                C_send(consolechannel, ":white_check_mark: Translate_en 已成功清除\n:warning: 已關閉 Channel_Adjustment_Notification 功能\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "Translate_zh_TW") {
            if (Number.isInteger(Number(x[1])) == true) {
                bot_json_cache["Translate_zh_TW"] = x[1]
                C_send(consolechannel, ":white_check_mark: Translate_zh_TW 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來套用新設定");

            } else if (x[1] == "clear") {
                bot_json_cache["Translate_zh_TW"] = "Channel_ID"
                bot_json_cache["Translate_zh_TW_State"] = false
                C_send(consolechannel, ":white_check_mark: Translate_zh_TW 已成功清除\n:warning: 已關閉 Channel_Adjustment_Notification 功能\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else if (x[0] == "Translate_Repeat_Tag") {
            if (x[1] == "true") {
                bot_json_cache["Translate_Repeat_Tag"] = true
                C_send(consolechannel, ":white_check_mark: Translate_Repeat_Tag 已成功設定為 [true]\n:warning: 使用 Reload 來套用新設定");
            } else if (x[1] == "false") {
                bot_json_cache["Translate_Repeat_Tag"] = false
                C_send(consolechannel, ":white_check_mark: Translate_Repeat_Tag 已成功設定為 [false]\n:warning: 使用 Reload 來套用新設定");
            } else {
                C_send(consolechannel, ":warning: 未知的附屬指令");
            }
        } else {
            C_send(consolechannel, ":warning: 未知的指令");
        }

    } catch (error) {
        err = err + ":name_badge: Error: 4-4-0009\n"
        E_error(":name_badge: Error: 4-4-0009", error)
    }
}
//#endregion









