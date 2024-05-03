import { printError } from "../utils/toastMessage.js";

export async function getTournaments() {
  return fetch("/api/games/tournaments/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    console.log(data);
    return data;
  }).catch((error) => {
    printError(error);
  });
}

export async function createTournament(tournamentName, username, users) {
  return fetch("/api/games/tournaments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({
      name: tournamentName ? tournamentName : "Tournament by " + username,
      participants: users,
    }),
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    printError(error);
  });
}

export async function getParticipations() {
  return fetch("/api/game/my-participations/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data;
  })
    .catch((error) => {
      printError(error);
    });
}

export async function joinTournament(tournamentId) {
  fetch(`/api/game/participation/${tournamentId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({
      has_started: true,
    }),
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