import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', {
      message: error.message,
      path: error.path,
      extensions: error.extensions,
      locations: error.locations
    });

    return {
      message: error.message,
      path: error.path,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
      }
    };
  }
});

// Create the handler without context to simplify the setup
const handler = startServerAndCreateNextHandler(server);

export async function POST(request: NextRequest) {
  try {
    return await handler(request);
  } catch (error) {
    console.error('Error in GraphQL POST handler:', error);
    return new Response(JSON.stringify({
      errors: [{
        message: 'Internal server error',
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      }]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify({
    message: 'GraphQL endpoint only accepts POST requests'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 