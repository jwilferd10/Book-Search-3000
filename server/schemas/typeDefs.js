//Define the necessary Query and Mutation types:

// import the gql tagged template function
const { gql } = require('apollo-server-express');

// Create typeDefs in following order: me -> mutation -> user -> book -> auth
const typeDefs = gql`
    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String], description: String, title: String!, bookId: String!, image: String, link: String): User
        removeBook(bookId: String!): User
    }

    type User {
        _id: ID!
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type savedBooks {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`;
// export the typeDefs
module.exports = typeDefs;