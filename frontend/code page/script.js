const editor = ace.edit("code-editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
  showLineNumbers: true,
  tabSize: 4,
});

document
  .getElementById("theme-selector")
  .addEventListener("change", function () {
    const theme = this.value;
    editor.setTheme(theme);
  });

document.getElementById("run-code").addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const code = editor.getValue();
  const outputElement = document.getElementById("output");
  const debugSuggestionsElement = document.getElementById("debug-suggestions");

  // Clear previous output and suggestions
  outputElement.textContent = "";
  debugSuggestionsElement.textContent = "";

  //Validate code
  if (!code.trim() || !/.*int\s+main\s*\(.*\).*/.test(code)) {
    outputElement.textContent =
      " Can't find code 😑. Note you must have int main() present in your code";
    return;
  }

  // Send code to server for compilation and execution
  outputElement.textContent = "Running...";
  try {
    const response = await fetch("http://localhost:3000/run-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    outputElement.textContent = result.output || "No output returned.";

    console.log("MindsDB Result:", result);

    // Handle the debug suggestions from MindsDB result here
    const debugSuggestionsElement =
      document.getElementById("debug-suggestions");
    debugSuggestionsElement.innerHTML = `<p><strong>Error:</strong> ${result.error_message}</p><p><strong>Suggestion:</strong> ${result.suggestion}</p>`;
  } catch (error) {
    console.error("Error running code:", error);
    outputElement.textContent = "Error running code. Please try again later.";
  }
  return false;
});

// Chatbot
document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chat-container");
  const chatHeader = document.getElementById("chat-header");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatLog = document.getElementById("chat-log");

  chatHeader.addEventListener("click", function () {
    chatContainer.classList.toggle("expanded");
  });

  function addMessage(content, className) {
    const message = document.createElement("div");
    message.className = "message " + className;
    message.innerHTML = content;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, I am unable to process your request at the moment.";
    }
  }

  async function handleSendMessage() {
    const userMessage = userInput.value;
    if (userMessage.trim()) {
      addMessage(userMessage, "user-message");
      userInput.value = "";

      const botResponse = await getBotResponse(userMessage);
      addMessage(botResponse, "bot-message");
    }
  }

  sendButton.addEventListener("click", handleSendMessage);

  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });
});
