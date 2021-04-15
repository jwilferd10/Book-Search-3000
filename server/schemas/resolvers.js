// Define the query and mutation functionality to work with the Mongoose models.

// Import from ApolloServerExpress, connect it to Authentication
const { AuthenticanError } = require('apollo-server-express');

// Import from auth, this is for our sign tokens
const { signToken } = require('../utils/auth');

// Import User from the models
const { User } = require('../models');

const resolvers = {
    // Create a query for me
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('books');
                return userData;
            }
            throw new AuthenticanError('Not logged in!');
        },
    },
    // Mutations for addUser, userLogin, saveBook, removeBook
    Mutation: {
        // Add User
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        // Add Login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })
            
            if (!user) {
                throw new AuthenticanError('Wrong Email!');
            }

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticanError('Wrong Password!');
            }

            const token = signToken(user);
            return { token, user };
        },
        // Save Book
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate (
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                )

                return updatedUser;
            }
            throw new AuthenticanError('You need to be logged in!');
        },
        // Remove Book
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate (
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                )
                
                return updatedUser;
            }

            throw new AuthenticanError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;