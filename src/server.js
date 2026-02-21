require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({extended: true }));

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
        return {
            mnessage: err.message,
            code: err.extensions.code,
            locations: err.locations,
            path: err.path
        }
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}${server.graphqlPath}`);
      });

    
  };

startServer();