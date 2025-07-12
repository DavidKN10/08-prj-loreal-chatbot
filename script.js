/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// keeps conversation history
let messages = [
  {
    role: "system", 
    content: `You are a helpful assistant for L'Oreal that helps users discover
              and understand L'Oreal's extensive range of products-makeup, skincare,
              haircare, and fragrances-as well as provide personalized routines and
              recommendations. If the user asks someting off topic, say that you can't
              answer that.` 
  }
];

const workerURL = "https://wonderbot-worker.davidrs23178.workers.dev/";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Function to render the conversation history */
function renderMessages() {
  let html = "";
  
  for (let i = 1; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "user") {
      html += `<div class="user-msg">${msg.content}</div>`;
    } else if (msg.role === "assistant") {
      html += `<div class="bot-msg">${msg.content}</div>`;
    }
  }
  chatWindow.innerHTML = html;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value;

  messages.push({
    role: "user",
    content: userMessage
  });

  // Render messages so far (including the new user message)
  renderMessages();

  // Show loading message
  chatWindow.innerHTML += `<div class="bot-msg">Thinking...</div>`;

  // Prepare the request body for the API
  const body = {
    model: "gpt-4o", 
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

    const data = await response.json();

    // Get the assistant's reply
    const botReply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "Sorry, I couldn't get a response.";

    messages.push({
      role: "assistant",
      content: botReply
    });

    renderMessages();
  } catch (error) {
    // Add error message to messages array
    messages.push({
      role: "assistant",
      content: "Sorry, there was an error. Please try again."
    });
    
    renderMessages();
  }

  // Clear the input box for the next message
  userInput.value = "";
});
