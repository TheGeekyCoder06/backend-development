import dotenv from 'dotenv';
dotenv.config();
import connectDb from '../db/dbConfig.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

console.log("GraphQL server is starting...");

import { typeDefs } from '../graphql/schema.js';
import { resolvers } from '../graphql/resolvers.js';

async function startServer() {
    await connectDb();
    const server = new ApolloServer({
        
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: process.env.PORT || 4000 },
    });

    console.log(`Server ready at: ${url}`);
}

startServer();
