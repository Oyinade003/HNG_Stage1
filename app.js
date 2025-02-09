const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());
const axios = require("axios");

const PORT = process.env.PORT || 3000;


const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
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

const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    return digits.reduce((sum, d) => sum + Math.pow(d, power), 0) === num;
};

app.get("/api/classify-number", async (req, res) => {
    const number = parseInt(req.query.number);

    if (isNaN(number)) {
        return res.status(400).json({
            number: req.query.number,
            error: true
        });
    }

    const properties = [];
    if (isArmstrong(number)) properties.push("armstrong");
    properties.push(number % 2 === 0 ? "even" : "odd");

    const digitSum = number.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);

    try {
        const { data } = await axios.get(`http://numbersapi.com/${number}/math?json`);
        const funFact = data.text;

        res.json({
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties,
            digit_sum: digitSum,
            fun_fact: funFact
        });
    } catch (error) {
        res.json({
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties,
            digit_sum: digitSum,
            fun_fact: "Fun fact not available."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
