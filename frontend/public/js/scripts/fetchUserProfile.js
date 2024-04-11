export const fetchUserProfileModule = (() => {
  function fetchUserProfile() {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found. Redirecting to login.");
      // Redirect to login or show an error message
      return;
    }
    fetch("/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the data object has keys 'name', 'email', 'location', and 'avatarUrl'
        console.log(data);
        document.getElementById("userName").textContent = data.name;
        document.getElementById("userEmail").textContent = data.email;
        //   document.getElementById("userLocation").textContent = data.location;
        if (data.avatar != null)
          document.getElementById("avatar").src = data.avatar;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
      });
  }
  return { fetchUserProfile };
})();
