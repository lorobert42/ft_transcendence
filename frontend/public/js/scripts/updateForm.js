import { editUser } from "../fetchers/usersFetcher.js";

export function updateForm() {
  const form = document.getElementById("updateForm");

  async function updateUser() {
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
    await editUser(formData);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateUser();
  });
}