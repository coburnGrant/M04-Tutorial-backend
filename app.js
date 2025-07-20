const express = require('express');
const cors = require('cors');

// Set up express
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Song = require('./models/song');

// Use cors to allow cross-origin requests
app.use(cors());

app.use(bodyParser.json());

// Set up routes

// Grab all songs in the database
router.get('/songs', async (req, res) => {
  // res.send("HELLO SONGS");
  // return;
  let query = {};

  if (req.query.genre) {
    query.genre = req.query.genre;
  }

  // Find all songs matching the query
  try {
    const songs = await Song.find(query);
    res.json(songs);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Grab a single song by ID
router.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;

  try {
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).send('Song not found');
    }
    res.json(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a song by ID
router.put('/songs/:id', async (req, res) => {
  console.log('Updating song with ID:', req.params.id);
  const songId = req.params.id;

  try {
    const song = req.body;

    await Song.updateOne({ _id: songId }, song);

    res.status(204).send('Song updated successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/songs', async (req, res) => {
  const song = new Song(req.body);

  try {
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (err) {
    res.status(400).send(err);
  }
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