/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

let messages = [
  {
    role: "system", 
    content: `You are a helpful assistant for L'Oreal that helps users discover
              and understand L'Oreal's extensive range of products-makeup, skincare,
              haircare, and fragrances-as well as provide personalized routines and
              recommendations.` 
  }
];

const workerURL = "https://wonderbot-worker.davidrs23178.workers.dev/";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's message from the input box
  const userMessage = userInput.value;

  // Add user's message to messages array
  messages.push({
    role: "user",
    content: userMessage
  });

  // Show user's message in the chat window
  chatWindow.innerHTML = `<div class="user-msg">${userMessage}</div>`;

  // Show loading message
  chatWindow.innerHTML += `<div class="bot-msg">Thinking...</div>`;

  // Prepare the request body for the API
  const body = {
    model: "gpt-4o", // Use OpenAI's gpt-4o model
    messages: messages
  };

  try {
    // Make a POST request to the worker URL
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Parse the response as JSON
    const data = await response.json();

    // Get the assistant's reply
    const botReply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "Sorry, I couldn't get a response.";

    // Add assistant's reply to messages array
    messages.push({
      role: "assistant",
      content: botReply
    });

    // Show both user and bot messages in the chat window
    chatWindow.innerHTML = `
      <div class="user-msg">${userMessage}</div>
      <div class="bot-msg">${botReply}</div>
    `;
  } catch (error) {
    // Show error message if something goes wrong
    chatWindow.innerHTML = `
      <div class="user-msg">${userMessage}</div>
      <div class="bot-msg">Sorry, there was an error. Please try again.</div>
    `;
  }

  // Clear the input box for the next message
  userInput.value = "";
});
