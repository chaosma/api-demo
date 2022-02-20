const path = require('path') 

const contractFilepath = path.join(__dirname, 'contractAddress.txt')
const contractFilepathOld = path.join(__dirname, 'contractAddress.old')

module.exports = {contractFilepath, contractFilepathOld}
