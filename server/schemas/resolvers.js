const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    books: async () => {
      return Book.find();
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { book }, { user }) => {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: book } },
            { new: true, runValidators: true }
          ).populate('savedBooks');
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error('Failed to save book.');
        }
      },
   
      removeBook: async (parent, { bookId }, { user }) => {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate('savedBooks');
          
          if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
          }
          
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error('Failed to delete book.');
        }
      },
    }
};

module.exports = resolvers;
