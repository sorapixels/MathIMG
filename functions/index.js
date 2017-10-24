const functions = require('firebase-functions');
const mathjax = require('mathjax-node');
const base64url = require('base64-url');
const svg2png = require('svg2png');

exports.image = functions.https.onRequest((req, res) => {
  const invert = req.url.includes('invert');
  const type = req.url.slice(-3);

  const opts = {math: base64url.decode(req.url.split('.')[0].substring(1)), svg: true};

  mathjax.typeset(opts, data => {
    if(data.errors && data.errors.join()) return res.status(400).send('Bad request');

    const svg = invert ? data.svg.replace(/currentColor/g, '#fff') : data.svg;

    if(type === 'svg') {
      res.set('Content-Type', 'image/svg+xml');
      return res.send(svg);
    } else {
      res.set('Content-Disposition', `attachment; filename=mathimg-${Date.now()}.png`);
      res.set('Content-Type', 'image/png');
      svg2png(svg, {height: 480}).then(buf => res.send(buf));
    }
  });
});
