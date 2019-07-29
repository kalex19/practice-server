const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3002;
const app = express();
const artists = require('./data');

app.locals = {
  artists
};

app.use(cors({
  allowedOrigins: ['localhost:3002']
}));
app.use(express.json());
app.listen(port, console.log(`Server is running on ${port}`));

app.get('/api/v1/artists', (req, res) => {
  res.status(200).json(app.locals.artists)
});

app.get('/api/v1/artists:id', (req, res) => {
  const {
    id
  } = req.params;
  const match = app.locals.artists.find(artist => {
    artist.id == id
  });
  if (!match) {
    return res.status(404).json({
      message: `No artist found with the id of ${id}`
    })
  }
  const filteredArtists = app.locals.artists.filter(artist => {
    artist.id == id
  });

  app.locals.artists = filteredArtists

  return res.status(202).json(app.locals.artists)
});

app.post('/api/v1/artists', (req, res) => {
  const newArtist = req.body;

  for (let requiredParam of ['id', 'name', 'song']) {
    if (!newArtist[requiredParam]) {
      return res.status(422).json({
        message: `You are missing a required parameter of ${requiredParam}`
      });
    }
  }

  const {
    id,
    name,
    song
  } = newArtist;

  app.locals.artists = [...app.locals.artists, {
    id,
    name,
    song
  }];

  return res.status(201).json({
    id,
    name,
    song
  });
});

app.delete('/api/v1/artists/:id', (req, res) => {
  const {
    id
  } = req.params;
  const match = app.locals.artists.find(artist => artist.id == id);

  if (!match) {
    return res.status(404).json({
      message: `No artist found with an id of ${id}`
    });
  }

  const filteredArtist = app.locals.artist.filter(artist => artist.id != id);

  app.locals.artists = filteredArtist;

  return res.status(202).json(app.locals.artists);
});