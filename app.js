const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('public'));

// Route to handle GET requests with playlistId parameter
app.get('/playlist/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId;

    try {
        // Perform a GET request using the playlistId parameter
        const response = await axios.get(`https://api.example.com/playlists/${playlistId}`);
        const playlistData = response.data;

        // Render a simple webpage with the playlist data
        res.send(`
            <html>
            <head>
                <title>Playlist</title>
            </head>
            <body>
                <h1>Playlist: ${playlistData.name}</h1>
                <ul>
                    ${playlistData.tracks.map(track => `<li>${track.name} by ${track.artist}</li>`).join('')}
                </ul>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error fetching playlist data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
