const express = require('express');
const fs = require('fs');

const server = express();

server.get('/', express.static('public'));

server.use((req, res, next) => {
  console.log(' I AM MIDDLEWARE');

  next();
});

// ` Layer of security
server.use((req, res, next) => {
  if (req.query.key === '1234') {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

server.get('/movie', (req, res) => {
  fs.readFile('movie.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({
        message: 'ERROR',
      });
    } else {
      res.status(200).json({
        message: 'SUCCESS',
        data: JSON.parse(data),
      });
    }
  });
});

server.post('/movie', (req, res) => {
  fs.readFile('movie.json', 'utf8', (err, data) => {
    const parseDATA = JSON.parse(data); // ` Because data is a string "JSON",
    parseDATA.push({
      name: req.query.name,
      year: req.query.year,
    });

    fs.writeFile('movie.json', JSON.stringify(parseDATA), (err) => {
      res.status(201).json({
        message: 'WE CREATED A NEW MOVIE',
      });
    });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
