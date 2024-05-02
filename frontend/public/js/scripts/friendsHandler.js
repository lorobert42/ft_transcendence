import { getUsers, getFriends, getInvites } from "../utils/friendsManagement.js";
import { getUserInfo } from "../utils/loginHandler.js";
import { printError } from "../utils/toastMessage.js";

let friends = [];
let users = [];
let invites = [];
let currentUser;

export async function friendsHandler() {
  currentUser = await getUserInfo();
  friends = await getFriends();
  mapFriends();
  invites = await getInvites();
  mapInvites();
  await updateUsers();
  mapUsers();
}

function mapFriends() {
  let friendList = document.getElementById("friend-list");
  friendList.innerHTML = "";
  friends.forEach((friend) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-content-center";
    const txt = document.createElement("p");
    txt.innerText = friend.email;
    txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
    txt.className = "d-flex";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("d-flex");

    // Create a button element for removing friend
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-danger btn-sm';
    addButton.textContent = 'Remove';
    addButton.addEventListener('click', () => {
      deleteFriend(friend.id);
      console.log(`Removed ${friend.email} from friend`);
    });

    buttonContainer.appendChild(addButton);
    li.appendChild(txt);
    li.appendChild(buttonContainer);

    friendList.appendChild(li);
  });
}

function mapInvites() {
  let invitesList = document.getElementById("pending-list");
  invitesList.innerHTML = "";
  invites.forEach((invite) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    const item = document.createElement("p");
    item.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
    item.className = "d-flex";
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("d-flex");
    if (invite.user1.id == currentUser.id) {
      item.innerText = invite.user2.email;
      optionsContainer.innerText = "Pending";
      li.appendChild(item);
      li.appendChild(optionsContainer);
    } else {
      item.innerText = invite.user1.email;

      // Create a button element for adding friend
      const addButton = document.createElement('button');
      addButton.className = 'btn btn-primary btn-sm';
      addButton.textContent = 'Accept';
      addButton.addEventListener('click', () => {
        acceptInvitation(invite);
        console.log(`Accepted ${invite.user1.email} as friend`);
      });

      // Create a button element for adding friend
      const denyButton = document.createElement('button');
      denyButton.className = 'btn btn-danger btn-sm';
      denyButton.textContent = 'Deny';
      denyButton.addEventListener('click', () => {
        refuseInvitation(invite);
        console.log(`Denied ${invite.user1.email} as friend`);
      });

      optionsContainer.appendChild(denyButton);
      optionsContainer.appendChild(addButton);

      li.appendChild(item);
      li.appendChild(optionsContainer);
    }
    invitesList.appendChild(li);
  });
}

async function updateUsers() {
  users = await getUsers();
  const usersToRemove = getInvitesAndFriendsEmails();
  users = users.filter((user) => {
    if (user.email === currentUser.email) {
      return false;
    }
    return !usersToRemove.has(user.email);
  });
}

function getInvitesAndFriendsEmails() {
  let emails = new Set([]);
  invites.map((invite) => {
    if (invite.user1.email === currentUser.email) {
      emails.add(invite.user2.email);
    } else {
      emails.add(invite.user1.email);
    }
  });
  friends.map((friend) => {
    emails.add(friend.email);
  });
  return emails;
}

function mapUsers() {
  let userList = document.getElementById("user-list");
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    const txt = document.createElement("p");
    txt.innerText = user.email;
    txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
    txt.className = "d-flex";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("d-flex");

    // Create a button element for adding friend
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary btn-sm';
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
      addFriend(user.id);
      console.log(`Added ${user.email} as friend`);
    });

    buttonContainer.appendChild(addButton);
    li.appendChild(txt);
    li.appendChild(buttonContainer);

    userList.appendChild(li);
  });
}

async function addFriend(id) {
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
  await friendsHandler();
}

async function deleteFriend(id) {
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
  await friendsHandler();
}

async function acceptInvitation(invite) {
  await fetch(`/api/friends/invitations/${invite.id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      "Content-Type": "application/json",
    },
    body: `{
        "response": "accept"
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
  await friendsHandler();
}

async function refuseInvitation(invite) {
  await fetch(`/api/friends/invitations/${invite.id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      "Content-Type": "application/json",
    },
    body: `{
        "response": "refuse"
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
  await friendsHandler();
}