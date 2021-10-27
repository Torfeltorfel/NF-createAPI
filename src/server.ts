import express from 'express';

const app = express();
const port = 3000;

// Custom middleware to log requests
app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

// Middleware for parsing application/json
app.use(express.json());

const users = [
  { name: 'Tri', email: 'tri@ding.de', password: '1234' },
  { name: 'Tra', email: 'tra@ding.de', password: '2345' },
  { name: 'Tru', email: 'tru@ding.de', password: '3456' },
  { name: 'Lala', email: 'lala@ding.de', password: '4567' },
];

/* app.post('/api/users', (request, response) => {
  const newUser = request.body;
  // users.splice(users.length, 0, newUser.name);
  users.push(newUser.name);
  response.send(`${newUser.name} added`);
}); */

app.post('/api/users', (request, response) => {
  const newUser = request.body;
  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.email !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send(`Bro, you missed sth!`);
  }
  if (users.some((user) => user.name === request.body.name)) {
    response.status(409).send(`the user ${request.body.name} already exist`);
  } else {
    users.push(newUser);
    response.send(users);
  }
});

app.delete('/api/users/:name', (request, response) => {
  const usersIndex = users.findIndex(
    (user) => user.name === request.params.name
  );
  if (usersIndex === -1) {
    response.status(404).send(`User ${request.params.name} doesn't exist 🙈`);
    return;
  }

  users.splice(usersIndex, 1);
  response.status(404).send(`User ${request.params.name} deleted 😄`);
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
