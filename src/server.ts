import express from 'express';

const app = express();
const port = 3000;
app.use(express.json());

let names = [{ name: 'superman' }, { name: 'batman' }, { name: 'Rotkäpchen' }];

app.get('/users/:name', (_req, res) => {
  const queryString = _req.params.name;
  const foundUser = names.find((user) => {
    if (queryString === user.name) {
      return true;
    } else {
      return false;
    }
  });

  if (foundUser) {
    res.send('wuwhuuuu');
  } else {
    res.status(404).send('noooooo');
  }
});

app.post('/users/', (req, res) => {
  res.send(req.body.name);
});

app.delete('/users/:name', (_req, res) => {
  names = names.filter((user) => user.name !== _req.params.name);
  res.send(names);
});

app.get('/', (_req, res) => {
  res.send(names);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
