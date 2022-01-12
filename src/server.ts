import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './utils/database';
import dotenv from 'dotenv';
dotenv.config();
import { getUserCollection } from './utils/database';

const app = express();
const port = 3000;

//throw an error, when link is wrong
if (!process.env.MONGODB_URI) {
  throw new Error('No MONGODB_URI provided');
}

// Custom middleware to log requests
app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

// Middleware for parsing application/json
app.use(express.json());

app.use(cookieParser());

const users = [
  { name: 'Jesus', email: 'tri@ding.de', password: '1234' },
  { name: 'Maria', email: 'tra@ding.de', password: '2345' },
  { name: 'Josef', email: 'tru@ding.de', password: '3456' },
  { name: 'Magdalena', email: 'lala@ding.de', password: '4567' },
];

//Add all users from local array into MongoDB
app.post('/api/allusers', async (_request, response) => {
  await getUserCollection().insertMany(users);
  response.send('Successfully uploaded in DB');
});

/* app.post('/api/users', (request, response) => {
  const newUser = request.body;
  // users.splice(users.length, 0, newUser.name);
  users.push(newUser.name);
  response.send(`${newUser.name} added`);
}); */

app.get('/api/me', async (request, response) => {
  const cookieName = request.cookies.username;
  const dbUser = await getUserCollection().findOne({
    name: cookieName,
  });
  if (dbUser) {
    response.send(dbUser);
  } else {
    response.status(404).send(`User not found`);
  }
});

// MONGO DB stuff
app.post('/api/users', async (request, response) => {
  const newUser = request.body;
  if (!newUser.name || !newUser.name || !newUser.password) {
    response.status(400).send(`Missing property`);
    return;
  }
  const isUserThere = await getUserCollection().findOne({
    name: newUser.name,
  });
  if (!isUserThere) {
    // users.splice(users.length, 0, newUser.name);
    const writeUser = await getUserCollection().insertOne(newUser);
    response.send(`${newUser.name} added with ID ${writeUser.insertedId}`);
  } else {
    response.status(409).send(`aleady existst`);
  }
});

app.post('/api/login', async (request, response) => {
  const findUser = request.body;
  const existingUser = await getUserCollection().findOne({
    name: findUser.name,
    password: findUser.password,
  });
  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.name}`);
    response.send(`welcome,${existingUser.name}`);
  } else {
    response.status(401).send('Password or username incorrect. Try again!');
  }
});

/////BUGGYY
app.delete('/api/users/:name', async (request, response) => {
  const urlName = request.params.name;
  const result = await getUserCollection().deleteOne({ name: urlName });
  if (result) {
    response.status(404).send(`User ${request.params.name} deleted 😄`);
  } else {
    response.status(404).send(`User ${request.params.name} doesn't exist 🙈`);
  }
});

app.get('/api/users/:name', (request, response) => {
  const user = users.find((user) => user.name === request.params.name);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This page is not here. Check another Castle');
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World');
});

connectDatabase(process.env.MONGODB_URI).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
