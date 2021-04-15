const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// Import Apollo-Server-Express
const { ApolloServer } = require('apollo-server-express');
// Import typedefs and resolvers, will be needed when created
const { typeDefs, resolvers } = require('./schemas');
// Import the authMiddleware for when it's modified
const { authMiddleware } = require('./utils/auth');
const auth = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add the Apollo Server and pass in schema data here
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Strike this off the to-do list
// This intergrates the apollo server with the Express Application as a middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// For now, we may not be needing this.
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

