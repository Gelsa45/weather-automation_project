document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weatherForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value.trim();

    const payload = { name, email, city };

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.style.color = "green";
        messageDiv.textContent = data.message;
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = data.error || "Something went wrong.";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      messageDiv.style.color = "red";
      messageDiv.textContent = "Server error. Please try again later.";
    }
  });
});
