const db = require('../config/connection');
const { BOOK, User } = require('../models');

const bookData = require('./bookData.json');
const userData = require('./userData.json');

db.once('open', async () => {
    await Book.deleteMany({});
    await User.deleteMany({});

    const books = await Book.insertmany(booksData);
    const users = await User.insertmany(usersData);

    console.log('Book and users seeded!');
    process.exit(0);

});