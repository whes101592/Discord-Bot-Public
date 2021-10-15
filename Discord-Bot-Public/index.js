//#region 變數
const { MessageEmbed, GuildMember } = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const fetch = require('node-fetch');
const axios = require('axios')
//#endregion

let ver = "21w42-Public"

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
let beta = ""
let update_json
let check_json
//#endregion

//#region 初始化文件檢測
fs.readFile(config_path, function (error, data) {
    if (error) {
        if (error.errno == -4058) {
            fetch('http://exptech.mywire.org/config.json')
                .then(function (res) {
                    return res.json();
                }).then(function (json) {
                    fs.writeFile(config_path, JSON.stringify(json), (err) => {
                    })
                })
        }
    }
})
fs.readFile(bot_path, function (error, data) {
    if (error) {
        if (error.errno == -4058) {
            fetch('http://exptech.mywire.org/bot.json')
                .then(function (res) {
                    return res.json();
                }).then(function (json) {
                    fs.writeFile(bot_path, JSON.stringify(json), (err) => {
                    })
                })
        }
    }
})
fs.readFile(string_path, function (error, data) {
    if (error) {
        if (error.errno == -4058) {
            fetch('http://exptech.mywire.org/string.json')
                .then(function (res) {
                    return res.json();
                }).then(function (json) {
                    fs.writeFile(string_path, JSON.stringify(json), (err) => {
                    })
                })
        }
    }
})
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
        } else if (err == "Update") {
            C_send(consolechannel, ":warning: 機器人已啟動 版本: " + ver + "\n:name_badge: 配置文件須更新 請使用 Update 完成更新");
            err = ""
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

            //#region update
            if (message.content == "Update" || message.content == "update" || message.content == "UPDATE") {
                C_send(consolechannel, ":white_check_mark: 驗證配置文件完整度 版本: " + ver);
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
                                C_send(consolechannel, ":warning: 不安全網址\n用戶: " + message.author.username + "\n類型: " + res.data["Type"] + "\n原文: " + message.content);
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
        fetch('http://exptech.mywire.org/update.json')
            .then(function (res) {
                return res.json();
            }).then(function (json) {
                update_json = json
                fs.readFile(string_path, function (error, data) {
                    if (error) {
                        err = err + ":name_badge: Error: 5-3-0004\n"
                        E_error(":name_badge: Error: 5-3-0004", error)
                    } else {
                        if (x != 1) string_json = JSON.parse(data.toString());
                        if (check != "") C_send(consolechannel, ":white_check_mark: string.json 加載完畢");
                    }
                    fs.readFile(bot_path, function (error, data) {
                        if (error) {
                            err = err + ":name_badge: Error: 5-3-0005\n"
                            E_error(":name_badge: Error: 5-3-0005", error)
                        } else {
                            if (x != 1) bot_json = JSON.parse(data.toString());
                            if (check != "") C_send(consolechannel, ":white_check_mark: bot.json 加載完畢");
                        }
                        fs.readFile(config_path, function (error, data) {
                            if (error) {
                                err = err + ":name_badge: Error: 5-1-0002\n"
                                E_error(":name_badge: Error: 5-1-0002", error)
                            } else {
                                if (x != 1) config_json = JSON.parse(data.toString());
                                if (check != "") C_send(consolechannel, ":white_check_mark: config.json 加載完畢");

                                let update_Ver = config_json["Update_ver"]
                                let update_ver = update_json["Update_ver"]
                                for (update_Ver; update_Ver <= update_ver; update_Ver++) {
                                    if (update_json[update_Ver][0]["config"] != undefined) {
                                        update_Array = update_json[update_Ver][0]["config"][0]["Index"]
                                        for (let index = 0; index < update_Array.length; index++) {
                                            if (config_json[update_Array[index]] == undefined) {
                                                if (check == "") err = "Update"
                                                if (check != "") C_send(consolechannel, ":arrow_up: " + update_Array[index] + " [" + update_json[update_Ver][0]["config"][0][update_Array[index]] + "]");
                                                if (check != "") config_json[update_Array[index]] = update_json[update_Ver][0]["config"][0][update_Array[index]]
                                            } else {
                                                if (check != "") C_send(consolechannel, ":placard: " + update_Array[index] + " [" + config_json[update_Array[index]] + "]");
                                            }
                                        }
                                    }
                                    if (update_json[update_Ver][0]["bot"] != undefined) {
                                        update_Array = update_json[update_Ver][0]["bot"][0]["Index"]
                                        for (let index = 0; index < update_Array.length; index++) {
                                            if (bot_json[update_Array[index]] == undefined) {
                                                if (check == "") err = "Update"
                                                if (check != "") C_send(consolechannel, ":arrow_up: " + update_Array[index] + " [" + update_json[update_Ver][0]["bot"][0][update_Array[index]] + "]");
                                                if (check != "") bot_json[update_Array[index]] = update_json[update_Ver][0]["bot"][0][update_Array[index]]
                                            } else {
                                                if (check != "") C_send(consolechannel, ":placard: " + update_Array[index] + " [" + bot_json[update_Array[index]] + "]");
                                            }
                                        }
                                    }
                                    if (update_json[update_Ver][0]["string"] != undefined) {
                                        update_Array = update_json[update_Ver][0]["string"][0]["Index"]
                                        for (let index = 0; index < update_Array.length; index++) {
                                            if (string_json[update_Array[index]] == undefined) {
                                                if (check == "") err = "Update"
                                                if (check != "") C_send(consolechannel, ":arrow_up: " + update_Array[index] + " [" + update_json[update_Ver][0]["string"][0][update_Array[index]] + "]");
                                                if (check != "") string_json[update_Array[index]] = update_json[update_Ver][0]["string"][0][update_Array[index]]
                                            } else {
                                                if (check != "") C_send(consolechannel, ":placard: " + update_Array[index] + " [" + string_json[update_Array[index]] + "]");
                                            }
                                        }
                                    }
                                    if (check != "") config_json["Update_ver"] = update_ver
                                    if (check != "") C_send(consolechannel, ":arrow_up: Update_ver [" + update_ver + "]");
                                }
                            }
                            if (err == "") {
                                if (check != "") C_send(consolechannel, ":white_check_mark: 配置文件加載成功 版本: " + ver);
                                fs.writeFile(string_path, JSON.stringify(string_json), function () {
                                })
                                fs.writeFile(config_path, JSON.stringify(config_json), function () {
                                })
                                fs.writeFile(bot_path, JSON.stringify(bot_json), function () {
                                })
                            } else {
                                if (check != "") C_send(consolechannel, ":warning: 配置文件加載完畢 版本: " + ver + "\n:name_badge: 加載過程拋出異常 試著根據 錯誤碼 來定位並修復錯誤" + "\n:name_badge: 本次更改將不會被保存至配置文件");
                            }
                            if (beta != "" && check != "") C_send(consolechannel, ":satellite: 已啟用 Beta 功能 可能導致崩潰 請留意\n" + beta);
                            if (check == "") check = "1"
                        })
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
        fetch('http://exptech.mywire.org/check.json')
            .then(function (res) {
                return res.json();
            }).then(function (json) {
                check_json = json
                x = x.split(" ")
                if (check_json[x[0]] != undefined) {
                    if (check_json[x[0]] == "number") {
                        if (Number.isInteger(Number(x[1])) == true) {
                            bot_json[x[0]] = x[1]
                            C_send(consolechannel, ":white_check_mark: " + x[0] + " 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來儲存設定");
                        } else {
                            C_send(consolechannel, ":warning: 未知的附屬指令");
                        }
                    } else if (check_json[x[0]] == null) {
                        bot_json[x[0]] = x[1]
                        C_send(consolechannel, ":white_check_mark: " + x[0] + " 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來儲存設定");
                    } else {
                        if (check_json[x[0]].indexOf(x[1]) != -1) {
                            bot_json[x[0]] = x[1]
                            C_send(consolechannel, ":white_check_mark: " + x[0] + " 已成功設定為 [" + x[1] + "]\n:warning: 使用 Reload 來儲存設定");
                        } else {
                            C_send(consolechannel, ":warning: 未知的附屬指令");
                        }
                    }
                } else {
                    C_send(consolechannel, ":warning: 未知的指令");
                }
            })
    } catch (error) {
        err = err + ":name_badge: Error: 4-4-0009\n"
        E_error(":name_badge: Error: 4-4-0009", error)
    }
}
//#endregion





