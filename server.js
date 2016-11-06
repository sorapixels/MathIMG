const express = require('express');
const app = express();
const mathjax = require('mathjax-node');
const base64url = require('base64-url');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.get('/:math.:type', (req, res) => {
  const type = req.params.type;
  const opts = {math: base64url.decode(req.params.math)};
  opts[type] = true;

  mathjax.typeset(opts, data => {
    const err = data.errors && data.errors.join();
    if(err) return res.status(400).send('Bad request');

    res.set('Content-Type', (type === 'svg') ? 'image/svg+xml' : 'image/png');
    return res.send(data[type]);
  });
});

app.get('*', (req, res) => res.status(400).send('Not found'));

app.listen(port, () => console.log(`Listening on port ${port}!`));
