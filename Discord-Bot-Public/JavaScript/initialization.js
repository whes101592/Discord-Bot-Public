const fs = require('fs');

exports.Token = function () {
    fs.readFile('./config.json', function (error, data) {
        if (error) {
            console.log('\x1b[31m', "Error: 5-1-001", '\x1b[0m')
        } else {
            json = JSON.parse(data.toString())
            console.log(json["token"])
            return json["token"]
        }
    })
}
