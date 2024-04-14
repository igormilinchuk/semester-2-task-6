require('dotenv').config(); 

const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.wxbrsxr.mongodb.net`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Помилка підключення до бази даних:'));
db.once('open', () => {
    console.log('Підключено до бази даних.');
});

const User = mongoose.model('User', {
    username: String,
    password: String
});

async function authenticate(username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error("Користувач не знайдений.");
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log("Пароль співпадає.");
        } else {
            console.log("Пароль не співпадає.");
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function addUser(username, password) {
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error("Користувач з таким ім'ям вже існує.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        console.log("Користувач доданий.");
    } catch (error) {
        console.error(error.message);
    }
}

const newUsername = 'exampleUser';
const newPassword = 's0/\/\P4$$w0rD';

addUser(newUsername, newPassword);
authenticate(newUsername, newPassword);
