import * as fs from 'fs'
import * as path from 'path'
const { ethers } = require('hardhat')

const abiDir = path.join(__dirname, '..', 'artifacts')
const solDir = path.join(__dirname, '..', 'contracts')

const getDefaultSigner = async () => {
	const signers = await ethers.getSigners()
	const signer = signers[0]

	return signer
}

const parseArtifact = (filename: string) => {
	let filePath = 'contracts/'

	if (!filePath.includes('.sol')) {
		filePath += `${filename}.sol`
	}

	const contractArtifact = JSON.parse(
		fs.readFileSync(path.join(abiDir, filePath, `${filename}.json`)).toString()
	)

	return [ contractArtifact.abi, contractArtifact.bytecode ]
}

export class JSONRPCDeployer {

    provider: any
    signer: any
    options: any

    constructor(privateKey: string, providerUrl: string, options?: any) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
        this.signer = new ethers.Wallet(privateKey, this.provider)
        this.options = options
    }

    async deploy(abi: any, bytecode: any, ...args): Promise<any> {
		const contractInterface = new ethers.utils.Interface( abi )
        const factory = new ethers.ContractFactory(contractInterface, bytecode, this.signer)
        return await factory.deploy(...args)
    }
}

class HardhatDeployer extends JSONRPCDeployer {

    constructor(privateKey: string, port: number, options?: any) {
        const url = `http://localhost:${port}/`
        super(privateKey, url, options)
    }
}

const genJsonRpcDeployer = (
    privateKey: string,
    url: string,
) => {

    return new JSONRPCDeployer(
        privateKey,
        url,
    )
}

const deployERC721 = async (quiet = false) => {
    log('Deploying ERC721...', quiet)
	const signer = await getDefaultSigner()
    const erc721Factory = await ethers.getContractFactory('NFTokenEnumerable', signer)
    return await erc721Factory.deploy()
}

const log = (msg: string, quiet: boolean) => {
    if (!quiet) {
        console.log(msg)
    }
}

export {
    genJsonRpcDeployer,
    abiDir,
    solDir,
    parseArtifact,
    deployERC721,
	getDefaultSigner
}
