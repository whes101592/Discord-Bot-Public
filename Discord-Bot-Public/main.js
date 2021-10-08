//#region 變數
const { MessageEmbed } = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
//#endregion

let ver = "21w41a-Public"

//#region 變數宣告區域
let err = ""
let consolechannel = ""
let config_json
let bot_json
let string_json
//#endregion

//#region 初始化
fs.readFile('./Json/config.json', function (error, data) {
    if (error) {
        E_error("Error: 5-1-001")
    } else {
        config_json = JSON.parse(data.toString());
        if (config_json["token"] != "") {
            if (config_json["console"] != "") {
                consolechannel = config_json["console"]
                fs.readFile('./Json/string.json', function (error, data) {
                    if (error) {
                        E_error("Error: 5-1-002")
                    } else {
                        string_json = JSON.parse(data.toString());
                    }
                })
                fs.readFile('./Json/bot.json', function (error, data) {
                    if (error) {
                        E_error("Error: 5-1-003")
                    } else {
                        bot_json = JSON.parse(data.toString());
                        if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
                            E_error("Error: 1-2-002")
                        }
                    }
                })
                fs.readFile('./Json/config.json', function (error, data) {
                    if (error) {
                        E_error("Error: 5-1-001")
                    } else {
                        config_json = JSON.parse(data.toString());
                    }
                })
                client.login(config_json["token"])
            } else {
                E_error("Error: 5-2-001")
            }
        } else {
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
        client.channels.cache.get(consolechannel).send(":warning: 機器人成功啟動 - " + ver + "\n:name_badge: 啟動過程拋出異常 試著使用 Reload 來定位錯誤");
    }
    console.log(`Logged in as ${client.user.tag}!`);
});
//#endregion

// 訊息處理區域
client.on('messageCreate', message => {

    //#region $ver
    if (message.content.startsWith("$ver")) {
        message.reply("版本: " + ver)
    }
    //#endregion

    //#region reload
    if (message.channel.id == consolechannel && (message.content == "reload" || message.content == "Reload" || message.content == "RELOAD")) {
        client.channels.cache.get(consolechannel).send(":white_check_mark: 正在重新加載配置文件 - " + ver);
        err=""
        cache()
    }
    //#endregion

    //#region 
    client.on('guildMemberAdd', user => {
        console.log(user)
        client.channels.cache.get(consolechannel).send(user);
    });
    //#endregion

    //#region 頻道創建
    client.on("channelCreate", channel => {
        if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
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
            client.channels.cache.get(consolechannel).send({ embeds: [exampleEmbed] });
        }
    })
    //#endregion

    //#region 頻道刪除
    client.on("channelDelete", channel => {
        if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
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
            client.channels.cache.get(consolechannel).send({ embeds: [exampleEmbed] });
        }
    })
    //#endregion

    //#region 檔案讀取
    function cache() {
        fs.readFile('./Json/string.json', function (error, data) {
            if (error) {
                err="1"
                client.channels.cache.get(consolechannel).send(":name_badge: Error: 5-1-002")
            } else {
                string_json = JSON.parse(data.toString());
                client.channels.cache.get(consolechannel).send(":white_check_mark: string.json 加載成功");
            }
            fs.readFile('./Json/bot.json', function (error, data) {
                if (error) {
                    err="1"
                    client.channels.cache.get(consolechannel).send(":name_badge: Error: 5-1-003")
                } else {
                    bot_json = JSON.parse(data.toString());
                    if (bot_json["Channel_Adjustment_Notification_State"] != false && bot_json["Channel_Adjustment_Notification"] == "Channel_ID") {
                        err="1"
                        client.channels.cache.get(consolechannel).send(":name_badge: Error: 1-2-002");
                    } else {
                        client.channels.cache.get(consolechannel).send(":white_check_mark: bot.json 加載成功");
                    }
                }
                fs.readFile('./Json/config.json', function (error, data) {
                    if (error) {
                        err="1"
                        client.channels.cache.get(consolechannel).send(":name_badge: Error: 5-1-001")
                    } else {
                        config_json = JSON.parse(data.toString());
                        client.channels.cache.get(consolechannel).send(":white_check_mark: config.json 加載成功");
                    }
                    if (err == "") {
                        client.channels.cache.get(consolechannel).send(":white_check_mark: 配置文件加載成功 - " + ver);
                    } else {
                        client.channels.cache.get(consolechannel).send(":warning: 配置文件加載完畢 - " + ver + "\n:name_badge: 加載過程拋出異常 試著根據 錯誤碼 來定位並修復錯誤");
                    }
                })
            })
        })
    }
    //#endregion

});

//#region 錯誤輸出調用
function E_error(error) {
    err = "1"
    console.log('\x1b[31m', error, '\x1b[0m')
}
//#endregion