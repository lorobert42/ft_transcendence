import { getFriends, getInvites, sendFriendInvitation, removeFriend, respondFriendInvitation } from "../fetchers/friendsFetcher.js";
import { getUserInfo, getUsers } from "../fetchers/usersFetcher.js";

let friends = [];
let users = [];
let invites = [];
let currentUser;

export function initFriendsHandler() {
  document.querySelector("#pending-search").addEventListener("input", (e) => {
    mapInvites();
  });
  document.querySelector("#user-search").addEventListener("input", (e) => {
    mapUsers();
  });
  document.querySelector("#friend-search").addEventListener("input", (e) => {
    mapFriends();
  });
  friendsHandler();
}

async function friendsHandler() {
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
  const search = document.getElementById("friend-search").value.toLowerCase();
  const filteredFriends = friends.filter((friend) => {
    return friend.email.toLowerCase().includes(search);
  });
  filteredFriends.forEach((friend) => {
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
  const search = document.getElementById("pending-search").value.toLowerCase();
  const filteredInvites = invites.filter((invite) => {
    return invite.user1.email.toLowerCase().includes(search) || invite.user2.email.toLowerCase().includes(search);
  });
  filteredInvites.forEach((invite) => {
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
  const search = document.getElementById("user-search").value.toLowerCase();
  const filteredUsers = users.filter((user) => {
    return user.email.toLowerCase().includes(search);
  });
  filteredUsers.forEach((user) => {
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
  await sendFriendInvitation(id);
  await friendsHandler();
}

async function deleteFriend(id) {
  await removeFriend(id);
  await friendsHandler();
}

async function acceptInvitation(invite) {
  await respondFriendInvitation(invite, 'accept');
  await friendsHandler();
}

async function refuseInvitation(invite) {
  await respondFriendInvitation(invite, 'refuse');
  await friendsHandler();
}