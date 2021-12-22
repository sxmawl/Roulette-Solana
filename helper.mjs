// const { async } = require("regenerator-runtime")

const getReturnAmount = (initalAmt, ratio) =>{
    const amt = initalAmt*ratio
    return amt;
}

const totalAmtToBePaid = (investment)=>{
    return investment
}

const randomNumber = (min, max) =>{
    return Math.floor(Math.random() * (max-min + 1)) + min
}

export {
    getReturnAmount,
    totalAmtToBePaid,
    randomNumber
}