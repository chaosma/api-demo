const shelljs = require('shelljs')
const logger = require('./logger').logger
const defaults = require('./defaults')
const Web3 = require('web3')
const { ethers } = require('hardhat')
const {parseArtifact, getDefaultSigner} = require('api-contracts')
const {contractExists} = require('./utils')

const mint = async (req, res) => {
    const ethProvider = defaults.DEFAULT_ETH_PROVIDER
    const signer = await getDefaultSigner()

    if (! (await contractExists(signer.provider, req.body["contract"]))) {
        console.error('Error: there is no ERC721 contract deployed at the specified address')
        return 1
    }

    const [ erc721 ] = parseArtifact('NFTokenEnumerable')
    const contract = new ethers.Contract(
        req.body["contract"],
        erc721,
        signer,
    )

    let tx
    try {
        tx = await contract.mint(
            req.body["address"],
            req.body["tokenId"],
            { gasLimit: 1000000 },
        )
        await tx.wait()
        res.send(`mint new NFT token ${req.body["tokenId"]} for ${req.body["address"]} with transaction hash: ${tx.hash}`)
    } catch(e) {
        if (e.message) {
            res.send(`mint new NFT error: the transaction failed with ${e.message}`)
        }
        return 1
    }
    return 0
}

const transfer = async (req, res) => {
    const ethProvider = defaults.DEFAULT_ETH_PROVIDER
    const signer = await getDefaultSigner()

    if (! (await contractExists(signer.provider, req.body["contract"]))) {
        console.error('Error: there is no ERC721 contract deployed at the specified address')
        return 1
    }

    const [ erc721 ] = parseArtifact('NFTokenEnumerable')
    const contract = new ethers.Contract(
        req.body["contract"],
        erc721,
        signer,
    )

    let tx
    try {
        tx = await contract.transferFrom(
            req.body["from"],
            req.body["to"],
            req.body["tokenId"],
            { gasLimit: 1000000 },
        )
        await tx.wait()
        res.send(`transfer ${req.body["tokenId"]} from ${req.body["from"]} to ${req.body["to"]} with transaction hash ${tx.hash}`)
    } catch(e) {
        if (e.message) {
            res.send(`transfer NFT error: the transaction failed with ${e.message}`)
        }
        return 1
    }
    return 0
}

async function handler(req, res) {
  let output, cmd
  let silent = true
  switch(req.body["method"]) {
    case "mint":
      if(!("address" in req.body && req.body["address"]) || !("contract" in req.body && req.body["contract"]) || !("tokenId" in req.body && req.body["tokenId"])){
         res.send("missing parameters...")
         break
      }
      await mint(req, res)
      break
    case "transfer": 
      if(!("from" in req.body && req.body["from"]) || !("to" in req.body && req.body["to"]) || !("contract" in req.body && req.body["contract"])) {
         res.send("missing parameters...")
         break
      }
      await transfer(req, res)
      break
    default:
      res.send("unknown method...")
  }
  if (!output) {
      return
  } else if(output.stderr) {
     res.send(`${req.body.method} failed with error: ${output.stderr}`)
  } else {
    res.send(`${output}`)
  }
}

module.exports = handler;
