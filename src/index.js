import { GraphQLServer } from 'graphql-yoga'
import faker from 'faker';

const users = [{
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    age: faker.random.number({min : 1, max: 100})
}, {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    age: faker.random.number({min : 1, max: 100})
}];

const posts = [{
    id: faker.random.uuid(),
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean()
}, {
    id: faker.random.uuid(),
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean()
}];

const typeDefs = `
    type Query {
      users(query:String): [User!]!  
      me: User!
      posts(query:String): [Post!]!
    }
    type User {
        id: ID!
        name: String!
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
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch
            })
        },
        me() {
            return {
               id: 123098,
               name: 'maria',
               email: 'maria@example.com',
           }
       }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log(faker);
   console.log('The server is up!')
});