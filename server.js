const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /submit to handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, city } = req.body;

  if (!name || !email || !city) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Fetch weather data from OpenWeatherMap API
    const apiKey = '45db7d511f491ccaddc97edc24465de7';  // <-- Replace with your API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      return res.status(404).json({ error: 'City not found.' });
    }
    const weatherData = await weatherResponse.json();

    // Compose email with weather alert
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gelsagreenson@gmail.com',        // <-- Replace with your Gmail address
        pass: 'fygs jwqs upcq hqdj',            // <-- Replace with your app password or OAuth token
      },
    });

    const mailOptions = {
      from: '"SkyNotify" <your.email@gmail.com>', // sender address
      to: email,
      subject: `Weather Alert for ${city}`,
      text: `Hello ${name},

Here is the current weather in ${city}:

Temperature: ${weatherData.main.temp} °C
Weather: ${weatherData.weather[0].description}
Humidity: ${weatherData.main.humidity}%
Wind Speed: ${weatherData.wind.speed} m/s

Thank you for subscribing to SkyNotify!
`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: 'Weather alert sent successfully!' });
  } catch (error) {
    console.error('Error in /submit:', error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
