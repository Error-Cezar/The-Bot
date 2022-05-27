
const app = require('express')();

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Anyway.`);
});

console.log("Server up!")
  
const Run = require(`${process.cwd()}/Bot.js`)
Run()

console.error("a")
module.exports = app;
