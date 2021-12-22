import web3 from '@solana/web3.js';

import inquirer from 'inquirer';
import figlet from 'figlet';
import chalk from 'chalk';

import {getBalance, airDropSol,transferSOL} from './solana.mjs';
import {totalAmtToBePaid, getReturnAmount, randomNumber} from './helper.mjs';

const userWalletSecurityKey =[
    12, 128,  21,  20,  13, 233,  87, 241, 187, 253,  22,
    98, 147,  44, 252, 178, 212,  86,  79,   0, 147, 186,
    63, 142,  39,   9,  67,  35, 168,  68,  29, 222, 246,
     2,  11,  24,  56, 232, 144, 215,  25, 153,  14,  14,
    65,  64, 242,  45, 105, 148, 223, 251, 168,  78, 121,
   221, 161, 248, 250,  46,  45,  89,  88, 244
 ]
const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userWalletSecurityKey));


const treasuryWalletSecurityKey = [
    148, 184,  79, 117, 228,  66, 196, 171,   2, 153, 147,
     64,  94, 203, 253,  69, 130,  81,  61, 184, 182, 122,
    172, 154,  75, 195, 201, 206, 175,  19, 224, 189, 130,
    255, 107, 138,  80, 137,  36, 134, 106,  86,  85,  80,
    178,  77, 247, 158, 248, 130, 222, 202, 136, 154,  79,
     62,  89,  93, 248,  53, 104, 201, 125,  23
]
const treasuryWallet = web3.Keypair.fromSecretKey(Uint8Array.from(treasuryWalletSecurityKey));


const welcomeMessage = () => {
    console.log(
        chalk.green.italic(
            figlet.textSync("SOL STAKE GAME",{
                font:"Standard",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    )
    console.log(chalk.red`You can stake maximum 1 SOL`);
}

const askForInput = ()=>{
    const questions = [
        {
            name: "stakeAmount",
            type: "number",
            message: "How much SOL you want to stake?",
        },
        {
            type: "rawlist",
            name: "stakingRatio",
            message: "What is the ratio of your staking?",
            choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
            filter: function(val) {
                const stakeFactor=val.split(":")[1];
                return stakeFactor;
            },
        },
        {
            name:"userGuessedNumber",
            type: "number",
            message:"Guess a random number from 1 to 5 (both 1, 5 included)",
            when: async function(val){
                if(parseFloat(totalAmtToBePaid(val.stakeAmount))>1){
                    console.log(chalk.red('You have violated the max stake limit. Stake with smaller amount.'));
                    return false
                }else{
                    console.log(`You need to pay ${chalk.yellow`${totalAmtToBePaid(val.stakeAmount)}`} to move forward ->`);
                    const userBalance = await getBalance(userWallet);
                    if(userBalance >= totalAmtToBePaid(val.stakeAmount)){
                        console.log(`You'll get ${chalk.green`${getReturnAmount(val.stakeAmount, val.stakingRatio)}`} on guessing the correct number`);
                        return true
                    }
                    else{
                        console.log(chalk.red`You don't have enough balance in your wallet`);
                        return false
                    }
                }
            }
        }
    ]
    return inquirer.prompt(questions);
}

const startGame = async() =>{
    welcomeMessage();
    const answers = await askForInput();
    if(answers.userGuessedNumber){
        const signature = await transferSOL(userWallet, treasuryWallet, totalAmtToBePaid(answers.stakeAmount))
        console.log(`Your payment signature for playing the game ${chalk.green`${signature}`}`);
        const correctNumber = randomNumber(1,5);
        console.log("Correct answer is ", correctNumber);
        if(answers.userGuessedNumber == correctNumber){
            // Winning amount in treasury
            await airDropSol(treasuryWallet, getReturnAmount(answers.stakeAmount, answers.stakingRatio));
            // Guess correct, rewarding with the SOL
            const prizeSignature = await transferSOL(treasuryWallet, userWallet, totalAmtToBePaid(answers.stakeAmount) + getReturnAmount(answers.stakeAmount, answers.stakingRatio));
            console.log(`You guessed it right!`);
            console.log(`Here's your winning signature ${chalk.green`${prizeSignature}`}`);
            const userBalance = await getBalance(userWallet);
            console.log(`Your new balance is ${chalk.magentaBright`${userBalance}`}`);
        }else{
            //try again
            console.log(chalk.italic.yellowBright`Better luck next time`);
            const userBalance = await getBalance(userWallet);
            console.log(`Your left balance is ${chalk.magentaBright`${userBalance}`}`);
        }
    }
}

startGame();