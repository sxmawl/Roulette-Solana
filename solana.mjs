import { Connection, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Keypair, PublicKey } from "@solana/web3.js";
// import { cluster } from "cluster";
import { async } from "regenerator-runtime";


const getBalance = async (userWallet) => {
    try{
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const targetWallet = Keypair.fromSecretKey(userWallet.secretKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(targetWallet.publicKey)
        )
        // console.log(`===> For wallet address ${targetWallet.publicKey}`);
        // console.log(` Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
        const balance = parseInt(walletBalance)/LAMPORTS_PER_SOL
        return balance
    }catch(err){
        console.log(err);
    }
}

const airDropSol = async (userWallet, amt) =>{
    
    try{
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const targetWallet = Keypair.fromSecretKey(userWallet.secretKey);
        console.log(`-- Airdropping 2 SOL --`);
        const fromAirDropSignature  = await connection.requestAirdrop(
            new PublicKey(targetWallet.publicKey),
            amt * LAMPORTS_PER_SOL
        )
        await connection.confirmTransaction(fromAirDropSignature);
    }catch(err){
        console.log(err);
    }
}

const transferSOL = async (from, to, transferAmt) =>{
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:new PublicKey(from.publicKey.toString()),
                toPubkey:new PublicKey(to.publicKey.toString()),
                lamports: transferAmt* LAMPORTS_PER_SOL
            })
        )
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    } catch (error) {
        console.log(error);
    }
}

export {getBalance, airDropSol, transferSOL}
