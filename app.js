const express = require('express');
const cors = require('cors');

// Set up express
const app = express();
const router = express.Router();

// Use cors to allow cross-origin requests
app.use(cors());

// Set up routes
router.get('/songs', (req, res) => {
    const songs = [
        {
            title: "We Found Love",
            artist: "Rihanna",
            popularity: 10,
            releaseDate: new Date(2011, 9, 22),
            genre: ['electro house']
        },
        {
            title: 'Happy',
            artist: 'Pharrell Williams',
            popularity: 10,
            releaseDate: new Date(2013, 10, 21),
            genre: ['soul', 'new soul']
        }
    ]

    res.json(songs);
});

app.use('/api', router);

// GET request for /hello
app.get('/hello', (req, res) => {
  res.send('<h1>Hello Express</h1>');
});

app.get('/goodbye', (req, res) => {
  res.send('<h1>Goodbye, Express!</h1>');
});

// Start web server
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
