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

export async function getUsers() {
  return await fetch("/api/user/users/", {
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