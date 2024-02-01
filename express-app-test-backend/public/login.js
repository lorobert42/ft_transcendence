function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://localhost:8080/api/user/token/", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      email: username,
      password: password,
    }),
  );
  xhttp.onreadystatechange = function () {
    console.log("readyState ", this.readyState);
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      console.log("response object ", objects);
      if (objects.token) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem("authToken", objects.token);
        // Or, if you prefer sessionStorage:
        // sessionStorage.setItem('authToken', response.token);

        console.log("Token stored");
        // Redirect or update UI as needed
      } else {
        Swal.fire({
          text: objects["message"],
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  return false;
}
