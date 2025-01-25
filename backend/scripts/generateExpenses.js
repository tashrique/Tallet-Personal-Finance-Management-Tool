const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Expense = require('../models/Expense');

dotenv.config();

const generateExpenses = async (num) => {
    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find(); // Fetch all users
    if (!users.length) {
        console.log('No users found. Please generate users first.');
        return;
    }

    for (let i = 0; i < num; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const expense = new Expense({
            userId: randomUser._id,
            title: faker.commerce.productName(),
            amount: faker.finance.amount(5, 500, 2), // Random amount between 5 and 500
            date: faker.date.past(1), // Random date in the past year
            category: faker.helpers.arrayElement(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment']),
            description: faker.lorem.sentence(),
        });

        await expense.save();
        console.log(`Expense ${i + 1} created for user: ${randomUser.email}`);
    }

    mongoose.disconnect();
};

generateExpenses(50) // Number of expenses to generate
    .then(() => console.log('Dummy expenses created'))
    .catch((err) => console.error(err));
