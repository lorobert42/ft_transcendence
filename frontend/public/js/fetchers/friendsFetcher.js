import { printError } from "../utils/toastMessage.js";

export async function getFriends() {
  const friendsObject = await fetch("/api/friends/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      printError("Unauthorized");
    }
    return response.json();
  }).then((data) => {

    return data;
  }).catch((error) => {
    printError(error);
  });
  return friendsObject['friends'];
}

export async function getInvites() {
  return await fetch("/api/friends/invitations/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      printError("Unauthorized");
    }
    return response.json();
  }).then((data) => {

    return data;
  }).catch((error) => {
    printError(error);
  });
}

export async function sendFriendInvitation(id) {
  await fetch(`/api/friends/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      "Content-Type": "application/json",
    },
    body: `{
        "user_id": ${id}
      }`,
  }).then((response) => {
    if (response.status === 401) {
      printError("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    printError(error);
  });
}

export async function removeFriend(id) {
  await fetch(`/api/friends/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      printError("Unauthorized");
    }
    return response.json();
  }).then((data) => {

    return data;
  }).catch((error) => {
    printError(error);
  });
}

export async function respondFriendInvitation(invite, response) {
  await fetch(`/api/friends/invitations/${invite.id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      "Content-Type": "application/json",
    },
    body: `{
        "response": "${response}"
      }`,
  }).then((response) => {
    if (response.status === 401) {
      printError("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    printError(error);
  });
}
