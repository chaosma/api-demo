const fs = require('fs')
const argparse = require('argparse')
const {readJSONFile, writeJSONFile} = require('./utils')
const {deployERC721} = require('api-contracts')
const {contractFilepath, contractFilepathOld} = require('./config')

const deploySubparser = (subparsers) => {
    const createParser = subparsers.addParser(
        'deploy',
        { addHelp: true },
    )
    createParser.addArgument(
        ['-t', '--type'],
        {
            required: true,
            type: 'string',
            help: 'type of the contract'
        }
    )
}

const deploy = async (args) => {
    if (args.type !== 'erc721') {
        console.log(`{args.type} is not supported`)
        return
    }
    const contract = await deployERC721()
    console.log('ERC721:', contract.address)
    if (fs.existsSync(contractFilepath)) {
      fs.renameSync(contractFilepath, contractFilepathOld)
    }
    writeJSONFile(contractFilepath, {'ERC721':contract.address})
    return 
}


const main = async () => {
    const parser = new argparse.ArgumentParser({ 
        description: 'api-demo Admin',
    })

    const subparsers = parser.addSubparsers({
        title: 'Subcommands',
        dest: 'subcommand',
    })

    deploySubparser(subparsers)

    const args = parser.parseArgs()

    // Execute the subcommand method
    if (args.subcommand === 'deploy') {
        await deploy(args)
    }
}

if (require.main === module) {
    main()
}
