const web3 = require("@solana/web3.js");

const connection  = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
//For checking whether the connection is successfully made
console.log(connection);

const userWallet = web3.Keypair.generate();
const userPublicKey = new web3.PublicKey(userWallet.publicKey).toString();
const userSecretKey = userWallet.secretKey;


const adminWallet = web3.Keypair.generate();
const adminPublicKey = new web3.PublicKey(userWallet.publicKey).toString();
const adminSecretKey = userWallet.secretKey;

