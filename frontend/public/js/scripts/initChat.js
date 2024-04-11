export default function initChat() {
  console.log("initializing chat");
  let authToken = localStorage.getItem("authToken");
  const chatLog = document.getElementById("chat-log");
  const messageInput = document.getElementById("chat-message-input");
  const messageSubmit = document.getElementById("chat-message-submit");

  const chatSocket = new WebSocket(
    `wss://localhost:8080/ws/chat/1/?token=${authToken}`,
  );

  chatSocket.onopen = function (e) {
    console.log("Connected to chat server");
  };

  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    console.log(data);
    chatLog.value += `${data.timestamp}   ${data.user}: ${data.message}\n`;
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
  };

  chatSocket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
    alert("Disconnected. Please refresh the page to reconnect.");
  };

  messageInput.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      // Enter key
      messageSubmit.click();
    }
  });

  messageSubmit.addEventListener("click", function (e) {
    const message = messageInput.value;
    chatSocket.send(JSON.stringify({ message: message }));
    messageInput.value = "";
  });

  document
    .querySelector("#chat-message-submit")
    .addEventListener("click", function (e) {
      const messageInputDom = document.querySelector("#chat-message-input");
      const message = messageInputDom.value.trim();
      if (message === "") return; // Prevent sending empty messages

      let authToken = localStorage.getItem("authToken"); // Retrieve the auth token stored in localStorage

      // Construct the POST request to send the new message
      fetch("/api/chat/message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        },
        body: JSON.stringify({
          message: message,
          // Include other necessary fields according to your API, such as chat room ID
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to send message");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Message sent successfully:", data);
          messageInputDom.value = ""; // Clear input field after successful send
          // Optionally, update the chat log with the new message here, or rely on the WebSocket connection to receive and display it.
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          // Handle error, e.g., by displaying a message to the user
        });
    });

  // To handle sending the message on pressing Enter, you can attach a similar logic to the "keyup" event of #chat-message-input,
  // checking if the key pressed is Enter, and then triggering the click event of #chat-message-submit or directly calling the fetch request.
}
