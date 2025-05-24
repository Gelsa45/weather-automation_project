document.getElementById('alertForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const city = document.getElementById('city').value.trim();

  // Basic validation
  if (!name || !email || !city) {
    displayMessage('Please fill all fields.', true);
    return;
  }

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ city, email })  // Only city and email are needed by the server
    });

    const data = await response.json();

    if (response.ok) {
      displayMessage(data.message);
      this.reset();  // Clear form on success
    } else {
      displayMessage(data.error || 'Submission failed.', true);
    }
  } catch (error) {
    displayMessage('Network error. Please try again.', true);
  }
});

function displayMessage(msg, isError = false) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : '#007acc';
}
