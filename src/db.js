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

const db = {
  users,
  posts,
  comments
};

export {db as default}