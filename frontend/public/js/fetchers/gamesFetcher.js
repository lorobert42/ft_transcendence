import { printError } from "../utils/toastMessage.js";

export async function getGames() {
  return fetch("/api/game/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => data)
    .catch((error) => {
      printError(error);
    });
}

export async function createGame(userId, friendId) {
  return fetch("/api/game/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    },
    body: `{
          "player2": ${friendId},
        }`,
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => data)
    .catch((error) => {
      printError(error);
    });
}
