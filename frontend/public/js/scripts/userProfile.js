import pageRouting from '../../changeContent.js'

export const userProfileModule = (() => {
  const fetchUserProfile = () => {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found. Redirecting to login.");
      // Redirect to login or show an error message
      return;
    }
    fetch("/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
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
        email = data.email;
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

  const otpEnableRequest = (password) => {
    console.log('OTP activation requested ' + email);
    fetch("/api/user/otp/activation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'email': email, 'password': password }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then((data) => {
        console.log(data);
        if (Object.hasOwn(data, "success") && data.success === true) {
          history.pushState({}, '', '/enable-otp');
          pageRouting({ 'id': data.user, 'qr_code': data.qr_code });
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        var errorString = error;
        const errorMessageDiv = document.getElementById("loginError");
        errorMessageDiv.textContent = errorString;
        errorMessageDiv.style.display = "block"; // Make the error message visible
      });
  };

  const init = () => {
    fetchUserProfile();
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("loginError");
        errorMessageDiv.style.display = "none"; // Make the error message visible
        const password = document.getElementById("password").value;
        otpEnableRequest(password);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  let email;

  return { init };
})();
