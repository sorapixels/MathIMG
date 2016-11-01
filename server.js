const express = require('express');
const app = express();
const mathjax = require('mathjax-node');
const base64url = require('base64-url');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.get('/:formula', (req, res) => {
  const opts = {math: base64url.decode(req.params.formula), svg: true};
  mathjax.typeset(opts, data => {
    const err = data.errors && data.errors.join();
    if(err) return res.status(404).send('Not found');
    res.set('Content-Type', 'image/svg+xml');
    res.send(data.svg);
  });
});

app.get('*', (req, res) => res.status(400).send('Not found'));

app.listen(port, () => console.log(`Listening on port ${port}!`));
