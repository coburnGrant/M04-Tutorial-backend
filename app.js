const express = require('express');
const cors = require('cors');

// Set up express
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const Song = require('./models/song');
const User = require('./models/user');



// Use cors to allow cross-origin requests
app.use(cors());

app.use(bodyParser.json());

const secret = 'supersecret';

// Set up routes

// Create a new user
router.post('/user', async (req, res) => {
  const user = req.body;
  const username = user.username;
  const password = user.password;

  const sendError = (msg) => {
    res.status(400).json({ error: msg })
  }

  if (!username || !password) {
    if (!username && !password) {
      sendError("Missing username and password");
    } else if (!username) {
      sendError("Missing username");
    } else if (!password) {
      sendError("Missing password");
    }
    return;
  }

  try {
    const newUser = new User(user);

    await newUser.save();

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Authenticate or login
// POST request is because when you login you are creating a new 'session'

router.post('/auth', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: "Missing username or password" });
    return
  }

  try {
    const user = await User.findOne({ username: req.body.username });

    const failedToAuth = () => {
      res.status(401).json({ error: "Failed to authenticate" });
    }

    if (!user) {
      failedToAuth()
      return
    }

    console.log(user);

    if (user.password !== req.body.password) {
      failedToAuth();
      return
    }

    // Create a token that is encoded with the JWT lib
    const username = user.username;
    const token = jwt.encode({ username: username }, secret);
    const auth = 1;

    // response with token

    res.json({
      username,
      token,
      auth
    })
  } catch (err) {
    res.sendStatus(500)
  }
});

// Check status of user with a valid token, see if it matches the front-end token
router.get('/status', async (req, res) => {
  const token = req.headers['x-auth']
  if (!token) {
    res.status(400).json({error: 'missing x-auth'});
    return;
  }

  try {
    const decoded = jwt.decode(token, secret);

    let users = await User.findOne({ username: decoded});
  } catch(err) {
    res.sendStatus(500);
  }
})

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

// Delete a song by ID
router.delete('/songs/:id', async (req, res) => {
  const songId = req.params.id

  try {
    await Song.deleteOne({ _id: songId });

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});