const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parents, args, context)  => {
            if (context.user) {
                const foundUser = await User.findOne({_id: context.user._id}).select('-password');
                return foundUser;
            }
            throw new AuthenticationError('User not logged in');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { user, token };
    },
    login: async (parent, { email, password }) => {
        const user =    await User.findOne({ email, password });

        if (!user) {
            throw new AuthenticationError('Incorrect Email');
        }

        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
            throw new AuthenticationError('Incorrect Password');
        }

        const token = signToken(user);
        return { user, token };
    },
    saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
            const updateUser = await User.findbyOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookData } },
                { new: true }
            );

            return updateUser;
        }

        throw new AuthenticationError('Please Login to save book.');
    },
    deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updateUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks:  bookId } },
            { new: true }
            );

};

    return updateUser;
    }

    throw new AuthenticationError('Please log in to delete book.');


        },
    },
};

module.exports =resolvers;

