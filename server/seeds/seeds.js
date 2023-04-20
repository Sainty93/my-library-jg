const db = require('../config/connection');
const { BOOK } = require('../models');

const bookData = require('./bookData.json');

db.once('open', async () => {
    await Book.deleteMany({});

    const books = await Book.insertmany(booksData);

    console.log('Book seeded!');
    process.exit(0);

});