const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load .env variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Weather API key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_actual_key_here';

// Route to handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, city } = req.body;

  try {
    // Fetch weather data
    const fetch = (await import('node-fetch')).default;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      return res.status(400).json({ error: 'City not found' });
    }

    const weatherData = await response.json();
    const temperature = weatherData.main.temp;
    const condition = weatherData.weather[0].description;
    const aqi = 'Not available in this API'; // For simplicity

    const summary = `Hello ${name},\n\nThe weather in ${city} is ${condition} with a temperature of ${temperature}°C.\nAir Quality: ${aqi}.\n\nRegards,\nWeather Bot`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // your email
        pass: process.env.EMAIL_PASS      // app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Weather Summary',
      text: summary
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!', weather: summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
