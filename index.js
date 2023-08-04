import { ethers } from "./ethers-5.6.esm.min.js"
import { ABI, contractAddress } from "./constant.js"
const connectBtn = document.getElementById('connectBtn')
const fundBtn = document.getElementById('fundBtn')
const balanceBtn = document.getElementById('balanceBtn')
const withdrawBtn = document.getElementById('withdrawBtn')


connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick =  withdraw

async function connect() {
    if (window.ethereum !== 'undefined') {
        console.log("Hello from MetaMask")
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        document.getElementById("connectBtn").innerHTML = "Connected!"
        console.log("connected")
    }
    else {
        console.log("No MetaMask")
    }
}

// Things we need for funding
// provide / connection to a blockchain
// siigner / wallet / someone with somegas
// contract that we are intracting with
//  ABI & address

async function fund() {
    const ethAmount = document.getElementById('ethamount').value
    console.log(`Funded amount is ${ethAmount}`)
    if (window.ethereum !== 'undefined') {
        // connect to metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // gonna return which ever wallet is connected to the provider(metamask)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, ABI, signer)
        try {
            const transactionResponse = await contract.fund(
                { value: await ethers.utils.parseEther(ethAmount) }
            )
            console.log(transactionResponse)
            // listen for transaction to be mined
            console.log(`Mining confirmation`)
            await listenTransactionMined(transactionResponse, provider)
        }
        catch (e) {
            console.log(e)
        }
    }
}


function listenTransactionMined(transactionResponse, provider) {
    return new Promise((resolve,reject)=>{   
        console.log(`Mining ${transactionResponse}...`)
        //  return new Promise()
        //  listen for transaction to finish
        provider.once(transactionResponse,async(transactionReceipt)=>{
            console.log(`completed with ${transactionReceipt.confirmations} confirmations`)
            resolve("done")
        })
    }
    )

}

// Reading from blockchain
async function getBalance(){
    if(typeof window.ethereum != 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw(){
    if(typeof window.ethereum != 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,ABI,signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenTransactionMined(transactionResponse,provider)
        } catch (error) {
            console.log(error)
        }
        
    }
}