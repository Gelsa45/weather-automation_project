const express = require('express');
//const fetch = require('node-fetch');
// For Node.js CommonJS modules:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files and parse form & JSON data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { city, email } = req.body;

    if (!city || !email) {
      return res.status(400).json({ error: 'City and email are required' });
    }

    // Fetch weather data
    const apiKey = process.env.WEATHER_API_KEY;
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      return res.status(404).json({ error: 'City not found' });
    }

    const weatherReport = `
      Weather in ${weatherData.name}:
      Temperature: ${weatherData.main.temp}°C
      Condition: ${weatherData.weather[0].description}
      Humidity: ${weatherData.main.humidity}%
      Wind Speed: ${weatherData.wind.speed} m/s
    `;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS        // Your Gmail App Password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Weather Report for ${weatherData.name}`,
      text: weatherReport
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Weather report sent successfully!' });

  } catch (error) {
    console.error('Error in /submit:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
