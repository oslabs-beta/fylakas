/**const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'your_username_here',
  password: 'your_password_here',
  database: 'your_database_here'
});

client.connect();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/db', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM your_table_here');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.send('Error fetching data from database');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
}); */