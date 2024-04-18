export async function contactHandler() {

    let authToken = localStorage.getItem('authToken');
    let friends = [];
    let users = [];
    let pending = [];

    async function updateFriends() {
       friends = await fetch("/api/user/me/", {
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
            return data["friends"];
          }).catch((error) => {
            console.error("Error:", error);
        });
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
        pending = await fetch("/api/user/friend-invitations/", {
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
            return data["pending"];
          }).catch((error) => {
            console.error("Error:", error);
        });
    }

    await updatePending();
    await updateFriends();
    await updateUsers();

    async function addFriend(id) {
        let response = await fetch("/api/user/add-friend/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
              "Content-Type": "application/json",
            },
            body: `{"friend_id": ${id}}`,
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
        filterFriends();
        filterUsers();

    }

    function firstTenUsers(usList) 
    {
        let firstTen = usList.slice(0, 10);
        let userList = document.getElementById("user-list");
        userList.innerHTML = "";
        firstTen.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerText = user.email;

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

    function firstTenFriends(frList) 
    {
        let firstTen = frList.slice(0, 10);
        let friendList = document.getElementById("friend-list");
        friendList.innerHTML = "";
        firstTen.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            const txt = document.createElement("p");
            txt.innerText = user.email;
            // txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            // Create a button element for adding friend
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-danger btn-sm';
            addButton.textContent = 'Remove';
            addButton.addEventListener('click', () => {
            // Handle adding friend functionality here, for example:
                console.log(`Removed ${user.email} from friend`);
            });

            buttonContainer.appendChild(addButton);
            li.appendChild(buttonContainer);

            friendList.appendChild(li);
        });
    }

    function filterUsers() {
        const search = document.getElementById("user-search").value.toLowerCase();
        let filteredUsers = users.filter((user) => user.email.toLowerCase().includes(search));
        filteredUsers = filteredUsers.filter((user) => !friends.includes(user.id));
        firstTenUsers(filteredUsers);
    }

    function filterFriends() {
        const search = document.getElementById("friend-search").value.toLowerCase();
        let filteredFriends = users.filter((user) => user.email.toLowerCase().includes(search));
        filteredFriends = filteredFriends.filter((user) => friends.includes(user.id));
        // let filteredFriends = friends.filter((user) => users.getItem.includes(search));
        firstTenFriends(filteredFriends);
    }


    document.querySelector("#user-search").addEventListener("input", (e) => {
        filterUsers();
    });

    document.querySelector("#friend-search").addEventListener("input", (e) => {
        filterFriends();
    });

    filterUsers();
    filterFriends();
}