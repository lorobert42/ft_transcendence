import pageRouting from '../../changeContent.js'

export const userProfileModule = (() => {
  const fetchUserProfile = async () => {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found. Redirecting to login.");
      // Redirect to login or show an error message
      return;
    }
    await fetch("/api/user/me", {
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
        user = data;
        if (data.avatar != null)
          document.getElementById("avatar").src = data.avatar;
      })
      .catch((error) => {
        printError(error);
      });
  }

  const otpEnableRequest = (password) => {
    fetch("/api/user/otp/activation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'email': user.email, 'password': password }),
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
        printError(error);
      });
  };

  const otpDisableRequest = (password, otp) => {
    fetch("/api/user/otp/disable/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'email': user.email, 'password': password, 'otp': otp }),
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
          printMessage('Two-Factor Authentication disabled');
          showOtpOption(false);
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
  };

  const showOtpOption = (otpEnabled) => {
    const otpEnable = document.getElementById("otpEnable");
    otpEnable.classList.add("d-none");
    const otpDisable = document.getElementById("otpDisable");
    otpDisable.classList.add("d-none");
    if (otpEnabled === false) {
      otpEnable.classList.remove("d-none");
      const otpForm = document.getElementById("otpForm");
      if (otpForm) {
        otpForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("otpEnablePassword").value;
          otpEnableRequest(password);
        });
      } else {
        console.error("Login form not found at init time.");
      }
    } else {
      otpDisable.classList.remove("d-none");
      const otpDisableForm = document.getElementById("otpDisableForm");
      if (otpDisableForm) {
        otpDisableForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("otpDisablePassword").value;
          const otp = document.getElementById("otp").value;
          otpDisableRequest(password, otp);
        });
      } else {
        console.error("Login form not found at init time.");
      }
    }
  };

  const printError = (message) => {
    const errorMessageDiv = document.getElementById("errorMessage");
    errorMessageDiv.textContent = message;
    const errorToast = document.getElementById("errorToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
    toastBootstrap.show();
  };

  const printMessage = (message) => {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    const messageToast = document.getElementById("messageToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(messageToast);
    toastBootstrap.show();
  };

  const init = async () => {
    await fetchUserProfile();
    showOtpOption(user.otp_enabled);
  };

  let user;

  return { init };
})();
