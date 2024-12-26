const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const qs = require('qs');  // Import qs for URL-encoded data
const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('public'));

// Function to request an access token
async function requestAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
    });

    try {
        const response = await axios.post(tokenUrl, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error requesting access token:', error);
        throw error;
    }
}

// Route to handle GET requests with playlistId parameter
app.get('/playlist/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId;

    try {
        // Request an access token
        const accessToken = await requestAccessToken();

        // Perform a GET request using the playlistId parameter and access token
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const playlistData = response.data;

        // Render a simple webpage with the playlist data, including album artwork
        res.send(`
            <html>
            <head>
                <title>Playlist</title>
            </head>
            <body>
                <h1>Playlist: ${playlistData.name}</h1>
                <ul>
                    ${playlistData.tracks.items.map(item => `
                        <li>
                            <img src="${item.track.album.images[0].url}" alt="${item.track.album.name} album artwork" width="300" height="300">
                            ${item.track.name} by ${item.track.artists.map(artist => artist.name).join(', ')}
                        </li>`).join('')}
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
