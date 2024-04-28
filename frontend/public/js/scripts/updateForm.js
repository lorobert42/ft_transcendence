import pageRouting from "../../changeContent.js";
import { getRefreshToken } from "../utils/loginHandler.js";
import { printMessage } from "../utils/toastMessage.js";

export function updateForm() {
  const form = document.getElementById("updateForm");

  function updateUser() {
    const formData = new FormData();
    const fileInput = document.getElementById("avatar");
    if (fileInput.files[0]) {
      formData.append("avatar", fileInput.files[0]);
    }
    const email = document.getElementById("email").value;
    if (email) {
      formData.append("email", email);
    }
    const name = document.getElementById("name").value;
    if (name) {
      formData.append("name", name);
    }
    const password = document.getElementById("password").value;
    if (password) {
      formData.append("password", password);
    }
    let authToken = localStorage.getItem("authToken");
    fetch("/api/user/me/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
      },
      body: formData,
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then(async () => {
      printMessage("Update successful");
      await getRefreshToken();
      history.pushState({}, '', '/profile');
      pageRouting();
    }).catch((error) => {
      console.error("Error:", error);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateUser();
  });
}