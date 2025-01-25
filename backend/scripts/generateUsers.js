const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');


const generateUsers = async (num) => {
    await mongoose.connect(process.env.MONGO_URI);

    for (let i = 0; i < num; i++) {
        const hashedPassword = await bcrypt.hash('password12345', 10);
        const user = new User({
            name: faker.internet.username(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: 'user', // Alternate between admin and user
        });

        await user.save();
        console.log(`User ${i + 1} created: ${user.email}`);
    }

    mongoose.disconnect();
};

generateUsers(10) // Number of users to generate
    .then(() => console.log('Dummy users created'))
    .catch((err) => console.error(err));
