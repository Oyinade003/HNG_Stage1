const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isArmstrong = (num) => {
    const digits = num.toString().split('').map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === num;
};

const isPerfect = (num) => {
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

const classifyNumber = async (num) => {
    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");

    let funFact = "";
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        funFact = response.data;
    } catch (error) {
        funFact = "Fun fact unavailable.";
    }

    return {
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0),
        fun_fact: funFact
    };
};

app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;
    const num = parseInt(number, 10);

    if (isNaN(num)) {
        return res.status(400).json({ number, error: true });
    }

    const result = await classifyNumber(num);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
