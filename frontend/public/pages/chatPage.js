export default function chatPage() {
  let authToken = localStorage.getItem("authToken");
  return `

  <div>
      <textarea id="chat-log" cols="100" rows="20" readonly></textarea><br>
      <input id="chat-message-input" type="text" size="100"><br>
      <input id="chat-message-submit" type="button" value="Send">

  </div>



    `;
}
