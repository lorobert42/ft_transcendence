export const routes = {
  "/": {
    name: "Home",
    view: "home_vw.js",
    features: [],
  },
  "/profile": {
    name: "Profile",
    view: "profile_vw.js",
    features: [],
  },
  "/gameroom": {
    name: "Game Room",
    view: "gameroom.js",
    features: [],
  },
  "/login": {
    name: "Login",
    view: "userLogin_vw.js",
    features: ["loginForm.js"],
  },
  "/register": {
    name: "Register",
    view: "userRegister.js",
    features: ["registerForm_vw.js"],
  },
  "/local": {
    name: "Local",
    view: "local_vw.js",
    features: [],
  },
  "/online": {
    name: "Online",
    view: "gameroom.js",
    features: ["game.js"],
  },
};
