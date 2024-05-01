import getUserInfo from "../utils/loginHandler.js";

export async function contactHandler() {
  let authToken = localStorage.getItem('authToken');
  let friends = [];
  let users = [];
  let pending = [];

  let loggedUser = await getUserInfo();

  async function updateFriends() {
    loggedUser = await getUserInfo();
    friends = loggedUser.friends;
  }

  async function updateUsers() {
    users = await fetch("/api/user/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
      },
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });
  }

  async function updatePending() {
    pending = await fetch("/api/friends/invitations/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
      },
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {

      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });


    console.log(pending);
  }

  await updatePending();
  await updateFriends();
  await updateUsers();


  async function addFriend(id) {
    let response = await fetch("/api/friends/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        "Content-Type": "application/json",
      },
      body: `{
              "user_id": ${id}
            }`,
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });

    await updateFriends();
    await updateUsers();
    await updatePending();
    filterFriends();
    filterUsers();
    filterPending();
  }

  async function denyFriend(id, otherID) {
    let response = await fetch(`/api/friends/invitations/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        "Content-Type": "application/json",
      },
      body: `{
            "response": "refuse"
          }`,
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });

    await updateFriends();
    await updateUsers();
    await updatePending();
    filterFriends();
    filterUsers();
    filterPending();
  }

  async function acceptFriend(id, otherID) {
    let response = await fetch(`/api/friends/invitations/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        "Content-Type": "application/json",
      },
      body: `{
          "response": "accept"
        }`,
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });

    await updateFriends();
    await updateUsers();
    await updatePending();
    filterFriends();
    filterUsers();
    filterPending();
  }


  async function deleteFriend(id) {
    let response = await fetch(`/api/friends/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });

    await updateFriends();
    await updateUsers();
    await updatePending();
    filterFriends();
    filterUsers();
    filterPending();
  }


  function firstTenUsers(usList) {
    let firstTen = usList.slice(0, 10);
    let userList = document.getElementById("user-list");
    userList.innerHTML = "";
    firstTen.forEach((user) => {
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
        console.log(user.id);
        addFriend(user.id);
        console.log(`Added ${user.email} as friend`);
      });

      buttonContainer.appendChild(addButton);
      li.appendChild(txt);
      li.appendChild(buttonContainer);


      userList.appendChild(li);
    });
  }

  function limitStringTo20Chars(str) {
    if (str.length > 20) {
      return str.slice(0, 16) + "...";
    } else {
      return str;
    }
  }

  function firstTenFriends(frList) {
    let firstTen = frList.slice(0, 10);
    let friendList = document.getElementById("friend-list");
    friendList.innerHTML = "";
    firstTen.forEach((user) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex align-content-center";
      const txt = document.createElement("p");
      txt.innerText = user.email;
      txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
      txt.className = "d-flex";

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("d-flex");

      // Create a button element for adding friend
      const addButton = document.createElement('button');
      addButton.className = 'btn btn-danger btn-sm';
      addButton.textContent = 'Remove';
      addButton.addEventListener('click', () => {
        // Handle adding friend functionality here, for example:
        deleteFriend(user.id);
        console.log(`Removed ${user.email} from friend`);
      });

      buttonContainer.appendChild(addButton);
      li.appendChild(txt);
      li.appendChild(buttonContainer);

      friendList.appendChild(li);
    });
  }

  function firstTenPending(penList) {
    let firstTen = penList.slice(0, 10);
    let pendingList = document.getElementById("pending-list");
    pendingList.innerHTML = "";
    firstTen.forEach((user) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      if (user.user2 == loggedUser) {
        const txt = document.createElement("p");
        txt.innerText = getUserEmailFromId(user.user1);
        txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
        txt.className = "d-flex";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("d-flex");

        // Create a button element for adding friend
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary btn-sm';
        addButton.textContent = 'Accept';
        addButton.addEventListener('click', () => {
          acceptFriend(user.id, user.user1);
          console.log(`Accepted ${user.user1} as friend`);
        });

        // Create a button element for adding friend
        const denyButton = document.createElement('button');
        denyButton.className = 'btn btn-danger btn-sm';
        denyButton.textContent = 'Deny';
        denyButton.addEventListener('click', () => {
          denyFriend(user.id, user.user1);
          console.log(`Denied ${user.user1} as friend`);
        });

        buttonContainer.appendChild(denyButton);
        buttonContainer.appendChild(addButton);

        li.appendChild(txt);
        li.appendChild(buttonContainer);

        pendingList.appendChild(li);
      }
      else {
        const txt = document.createElement("p");
        txt.innerText = getUserEmailFromId(user.user2);
        txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
        txt.className = "d-flex";

        const txtContainer = document.createElement("div");
        txtContainer.classList.add("d-flex");
        txtContainer.innerText = "Pending";

        li.appendChild(txt);
        li.appendChild(txtContainer);

        pendingList.appendChild(li);

      }

    });
  }

  function filterUsers() {
    const search = document.getElementById("user-search").value.toLowerCase();
    let filteredUsers = users.filter((user) => user.email.toLowerCase().includes(search));
    filteredUsers = filteredUsers.filter((user) => !friends.includes(user.id));
    filteredUsers = filteredUsers.filter((user) => user.id != loggedUser);
    let PendingUsers = generatePendingUserList();
    console.log(PendingUsers);
    filteredUsers = filteredUsers.filter((user) => !PendingUsers.includes(user.email));

    firstTenUsers(filteredUsers);
  }

  function filterFriends() {
    console.log(friends);
    const search = document.getElementById("friend-search").value.toLowerCase();
    let filteredFriends = users.filter((user) => user.email.toLowerCase().includes(search));
    filteredFriends = filteredFriends.filter((user) => friends.includes(user.id));
    // let filteredFriends = friends.filter((user) => users.getItem.includes(search));
    firstTenFriends(filteredFriends);
  }


  const search = document.getElementById("pending-search").value.toLowerCase();

  function generatePendingUserList() {
    let pendingList = pending.filter((invite) => invite["status"] == "pending");
    console.log("Pending List: ", pendingList);
    pendingList = pendingList.map((invite) => getUserEmailFromId(invite[`${invite.user1 != loggedUser ? "user1" : "user2"}`]));
    return pendingList;
  }

  function filterPending() {
    const search = document.getElementById("pending-search").value.toLowerCase();
    let newPending = pending.filter((invite) => invite["status"] == "pending");
    newPending = newPending.filter((invite) => invite["user1"] == loggedUser || invite["user2"] == loggedUser);
    newPending = newPending.filter((invite) => {
      if (invite.user1 == loggedUser) {
        return getUserEmailFromId(invite.user2).includes(search);
      }
      else {
        return getUserEmailFromId(invite.user1).includes(search);
      }
    });
    firstTenPending(newPending);
  }

  document.querySelector("#user-search").addEventListener("input", (e) => {
    filterUsers();
  });

  document.querySelector("#friend-search").addEventListener("input", (e) => {
    filterFriends();
  });

  document.querySelector("#pending-search").addEventListener("input", (e) => {
    filterPending();
  });

  filterUsers();
  filterFriends();
  filterPending();
}