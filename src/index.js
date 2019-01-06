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

let users = [{
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

let posts = [{
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

let comments = [{
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
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
            const emailTaken = users.some((user) => user.email === args.data.email);

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const one = {
                name: 'Philadelphia'
            };

            const two = {
                population: 1500000,
                ...one
            };

            const user = {
                id: uuidv4(),
                ...args.data
            };

            users.push(user);

            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) =>user.id === args.id);

            if (userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id);
                }

                return !match;
            });
            comments = comments.filter((comment) => comment.author !== args.id);

            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);

            console.log(userExists);
            if (!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            };

            posts.push(post);

            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) {
                throw new Error('Post not found')
            }

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);
            const postExists = posts.some((post) => post.published === true && post.id === args.data.post);

            if (!userExists && !postExists) {
                throw new Error('Unbale to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error('Comment not found')
            }

            const deletedComments = comments.splice(commentIndex, 1);
            return deletedComments[0];
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