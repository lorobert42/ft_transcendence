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
            "player1": ${userId},
            "player2": ${friendId},
            "score1": 0,
            "score2": 0
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

export async function createGameInvitation(id, userId, friendId) {
  return fetch("/api/game/game-invitations/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    },
    body: `{
        "id": ${id},
        "status": "pending",
        "game": ${id},
        "player1": ${userId},
        "player2": ${friendId}
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