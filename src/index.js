import { GraphQLServer } from 'graphql-yoga'
import faker from 'faker';

let user1_id = faker.random.uuid();
let user2_id = faker.random.uuid();

const users = [{
    id: user1_id,
    name: faker.name.firstName(),
    email: faker.internet.email(),
    age: faker.random.number({min : 1, max: 100})
}, {
    id: user2_id,
    name: faker.name.firstName(),
    email: faker.internet.email(),
    age: faker.random.number({min : 1, max: 100})
}];

const posts = [{
    id: faker.random.uuid(),
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user1_id
}, {
    id: faker.random.uuid(),
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user2_id
}, {
    id: faker.random.uuid(),
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user2_id
}];

const typeDefs = `
    type Query {
      users(query:String): [User!]!  
      posts(query:String): [Post!]!
      me: User!
      post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String
        published: Boolean!
        author: User!
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
       },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
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