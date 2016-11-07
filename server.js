const express = require('express');
const app = express();
const mathjax = require('mathjax-node');
const base64url = require('base64-url');
const svg2png = require('svg2png');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.get('/:math.:type', (req, res) => {
  const type = req.params.type;
  const opts = {math: base64url.decode(req.params.math), svg: true};

  mathjax.typeset(opts, data => {
    const err = data.errors && data.errors.join();

    if(err) return res.status(404).send('Not found');

    res.set('Cache-Control', 'public, max-age=31557600');
    res.set('Content-Type', (type === 'svg') ? 'image/svg+xml' : 'image/png');

    if(type === 'svg') {
      res.send(data.svg);
    } else {
      svg2png(data.svg, {height: 840}).then(buffer => res.send(buffer));
    }
  });
});

app.get('*', (req, res) => res.status(400).send('Not found'));

app.listen(port, () => console.log(`Listening on port ${port}!`));
