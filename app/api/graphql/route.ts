import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import resolvers from './resolvers';
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

    // Don't expose internal server errors to the client
    const message = error.message.includes('Internal server error') 
      ? 'An unexpected error occurred'
      : error.message;

    return {
      message,
      path: error.path,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
      }
    };
  },
  introspection: true,
  plugins: [
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            console.error('GraphQL Request Errors:', requestContext.errors);
          },
        };
      },
    },
  ],
});

// Create the handler without context to simplify the setup
const handler = startServerAndCreateNextHandler(server);

export async function POST(request: NextRequest) {
  console.log('--- ENTERING GraphQL POST HANDLER ---');
  try {
    // Clone the request before reading its body
    const clonedRequest = request.clone();
    
    // Log the incoming request body for debugging
    const body = await clonedRequest.json();
    console.log('GraphQL Request:', {
      query: body.query,
      variables: body.variables,
      operationName: body.operationName
    });

    if (!body.query) {
      console.error('No query provided in request');
      return new Response(JSON.stringify({
        errors: [{
          message: 'No query provided',
          extensions: { code: 'BAD_REQUEST' }
        }]
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('--- CALLING Apollo Server Handler ---');
    const response = await handler(request);
    console.log('--- RETURNED FROM Apollo Server Handler ---');
    
    // Log the response status and body for debugging
    console.log('GraphQL Response Status:', response.status);
    
    if (!response.ok) {
      // Clone the response before reading it
      const clonedResponse = response.clone();
      let errorMessage = 'An unexpected error occurred';
      let errorDetails = null;
      
      try {
        const responseBody = await clonedResponse.json();
        console.error('GraphQL Error Response:', responseBody);
        
        if (responseBody.errors?.[0]) {
          errorMessage = responseBody.errors[0].message;
          errorDetails = responseBody.errors[0];
          
          // Log the specific error details
          console.error('GraphQL Error Details:', {
            message: errorMessage,
            path: errorDetails.path,
            locations: errorDetails.locations,
            extensions: errorDetails.extensions
          });
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      console.log('--- RETURNING 500 from POST handler (response not ok) ---');
      return new Response(JSON.stringify({
        errors: [{
          message: errorMessage,
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            details: errorDetails
          }
        }]
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('--- RETURNING response from POST handler (response ok) ---');
    return response;
  } catch (error) {
    console.error('Error in GraphQL POST handler:', error);
    console.log('--- RETURNING 500 from POST handler (catch block) ---');
    return new Response(JSON.stringify({
      errors: [{
        message: 'An unexpected error occurred',
        extensions: { 
          code: 'INTERNAL_SERVER_ERROR'
        }
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