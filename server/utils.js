const fs = require('fs')

exports.readJSONFile = (filename) => {
   if (!fs.existsSync(filename)) {
      return ""
   }
   let data = fs.readFileSync(filename).toString()
   let jdata = JSON.parse(data)
   return jdata
}

exports.writeJSONFile = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data))
}

exports.contractExists = async (provider, address) => {
    const code = await provider.getCode(address)
    return code.length > 2
}

