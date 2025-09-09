import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { authMiddleware } from "./Middleware/Auth.js";
import { typeDefs } from "./graphql/schema.js"; 
import { resolvers } from "./graphql/schema.js"; 

dotenv.config();

const app = express();

app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // Await auth middleware to complete
        await new Promise((resolve) => authMiddleware(req, res, resolve));
        return { user: req.user };
      },
    })
  );

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();
