import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
      users: [User!]!  
      me: User!
      post: Post!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    
    type Post {
        id: ID!
        title: String!
        body: String
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        me() {
            return {
               id: 123098,
               name: 'maria',
               email: 'maria@examplo.com',
           }
       },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
   console.log('The server is up!')
});