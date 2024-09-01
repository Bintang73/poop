// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, JS) if needed
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch video URL and render EJS template
app.get('/:id', async (req, res) => {
    try {
        // Fetch the video key
        const { id } = req.params;
        const response = await fetch('https://poopdown.com/getKey.php?id=' + id, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'priority': 'u=1, i',
                'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: 'https://poopdown.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });
        const data = await response.json();
        const fileKey = data.file;

        // Fetch the direct video link
        const videoResponse = await fetch(`https://mba.dog/download.php?key=${encodeURIComponent(fileKey)}`, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'authorization': '90paDOwkMAKasd',
                'content-type': 'application/json',
            },
            method: 'GET'
        });
        const videoData = await videoResponse.json();
        console.log(videoData)

        // Render the EJS template with the video URL
        res.render('index', { videoUrl: videoData.direct_link });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
