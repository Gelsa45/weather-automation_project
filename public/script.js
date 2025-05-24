document.getElementById('alertForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const city = document.getElementById('city').value.trim();

  const messageDiv = document.getElementById('message');
  messageDiv.textContent = 'Sending alert...';

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, city }),
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = data.message;
      this.reset();
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = data.error || 'Error sending alert.';
    }
  } catch (error) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Network error, please try again.';
  }
});
