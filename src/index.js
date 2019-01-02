import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import faker from 'faker';

let user1_id = faker.random.uuid();
let user2_id = faker.random.uuid();

let post1_id = faker.random.uuid();
let post2_id = faker.random.uuid();
let post3_id = faker.random.uuid();

let comment1_id = faker.random.uuid();
let comment2_id = faker.random.uuid();
let comment3_id = faker.random.uuid();
let comment4_id = faker.random.uuid();

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
    id: post1_id,
    title: faker.lorem.word(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user1_id
}, {
    id: post2_id,
    title: faker.lorem.word(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user2_id
}, {
    id: post3_id,
    title: faker.lorem.word(),
    body: faker.lorem.paragraph(),
    published: faker.random.boolean(),
    author: user2_id
}];

const comments = [{
    id: comment1_id,
    text: faker.lorem.text(),
    author: user1_id,
    post: post1_id
}, {
    id: comment2_id,
    text: faker.lorem.text(),
    author: user1_id,
    post: post2_id
}, {
    id: comment3_id,
    text: faker.lorem.text(),
    author: user2_id,
    post: post2_id
}, {
    id: comment4_id,
    text: faker.lorem.words(),
    author: user2_id,
    post: post3_id
}];

const typeDefs = `
    type Query {
        users(query:String): [User!]!  
        posts(query:String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String
        published: Boolean!
        author: User!
        comments:[Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        comments(parent, args, ctx, info) {
            return comments
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.email);

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            };

            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author);

            if (!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            };

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author);
            const postExists = posts.some((post) => post.published === true && post.id === args.post);

            if (!userExists && !postExists) {
                throw new Error('Unbale to find user and post')
            }

            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
            };

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        },
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
   console.log('The server is up!')
});