const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.COMMAND_PORT;

const shankisms = process.env.SHANKISMS.split(',');
const app = express();

app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));

const getRandomShankism = () => {
  const sIndex = Math.floor(Math.random() * shankisms.length);
  return shankisms[sIndex];
}

const sendAttachment = (filename, text) => {
  return {
    text,
    fallback: text,
    attachments: [
      {
        image_url: `https://${process.env.COMMAND_ENDPOINT}/assets/${filename}`,
      }
    ]
  }
};

const auth = (req, res, next) => {
  if (req.body.token === process.env.VERIFICATION_TOKEN) {
    return next();
  } else {
    res.sendStatus(401);
  };
}

app.post('/shankism', auth, (req, res) => {
  res.send(getRandomShankism());
});

app.post('/theshankman', auth, (req, res) => {
  const shanksponse = sendAttachment('theshank.png', 'This is what a winner looks like');
  res.json(shanksponse);
});

app.post('/obijohn', auth, (req, res) => {
  const shanksponse = sendAttachment('obijohn-kenobi.jpg', 'May the shank be with you');
  res.json(shanksponse);
});



app.listen(PORT, () => console.log(`LISTENING ON ${PORT}`));

