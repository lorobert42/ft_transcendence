function getUserInfo() {
  let authToken = localStorage.getItem("authToken");
  console.log("authToken ", authToken);
  try {
    console.log("Token retrieved");

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8000/api/user/me/", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (authToken) {
      // Use the authToken in your API calls
      // Example: set it in the Authorization header
      xhttp.setRequestHeader("Authorization", "Token " + authToken);
    }

    xhttp.send();
    xhttp.onreadystatechange = function () {
      console.log("this.readyState ", this.readyState);
      if (this.readyState == 4) {
        if (this.status == 200) {
          const objects = JSON.parse(this.responseText);

          console.log("response object ", objects);
          document.getElementById("name").innerHTML = objects["email"];
        } else {
          const objects = JSON.parse(this.responseText);
          console.log("response object ", objects);
          Swal.fire({
            text: objects["detail"],
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
  } catch (error) {
    console.log("Error retrieving token from localStorage: ", error);
  }

  return false;
}
