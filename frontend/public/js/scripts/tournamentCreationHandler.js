import pageRouting  from '../../changeContent.js';
import { printMessage, printError, printSuccess } from '../utils/toastMessage.js';

export async function tournamentCreationHandler(dataDict = {}) {
    //fetch all friends
    let authToken = localStorage.getItem('authToken');
    let friends = [];
    let users = [];
    let available = [];
    let selected = [];

    await updateUsers();
    await updateFriends();

    const availablePlayers = document.getElementById('availablePlayers');
    const selectedPlayers = document.getElementById('selectedPlayers');
    // let playerSelect = document.getElementById("tournamentPlayerSelect");

    availablePlayers.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
          if(selected.length === 7)
          {
            printError("You can only select a maximum of 7 players", "error");
            return ;
          }  
          selected.push(available.splice(available.findIndex((user) => user.name === event.target.textContent), 1)[0]);
          filterFriends();
          firstTenSelected(selected);
        }
    });

    selectedPlayers.addEventListener('click', function(event) {
        if(event.target.tagName === 'LI') {
            available.push(selected.splice(selected.findIndex((user) => user.name === event.target.textContent), 1)[0]);
            filterFriends();
            firstTenSelected(selected);
        }
    });

    function firstTenFriends(frList) {
      let firstTen = frList.slice(0, 10);
      availablePlayers.innerHTML = "";
      firstTen.forEach((user) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-center align-items-center";
        li.textContent = user.name;
        availablePlayers.appendChild(li);
      });}

      function firstTenSelected(frList) { 
        let firstTen = frList.slice(0, 8);
        selectedPlayers.innerHTML = "";
        firstTen.forEach((user) => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-center align-items-center";
          li.textContent = user.name;
          selectedPlayers.appendChild(li);
        });
      }



  function filterFriends() {
      const search = document.getElementById("available-search").value.toLowerCase();
      let filteredFriends = available.filter((user) => user.email.toLowerCase().includes(search));
      firstTenFriends(filteredFriends);
  }

  function initAvailable() {
    const search = document.getElementById("available-search").value.toLowerCase();
    let filteredFriends = users.filter((user) => user.email.toLowerCase().includes(search));
    filteredFriends = filteredFriends.filter((user) => friends.includes(user.id));
    available = filteredFriends;
    firstTenFriends(filteredFriends);
  }

  document.getElementById("available-search").addEventListener("input", filterFriends);

  initAvailable();

  document.getElementById("create-tournament").addEventListener("click", (e) => {
      e.preventDefault();
      if(selectedPlayers.childNodes.length != 3  && selectedPlayers.childNodes.length != 7) {
          printError("You must select 3 or 7 players to create a tournament", "error");
          return;
      }
      let selectedPlayersList = [];
      selectedPlayers.childNodes.forEach((child) => {
          selectedPlayersList.push(users.find((user) => user.name === child.textContent).id);
      });

      let tournamentName = document.getElementById("tournament-name").value;
      fetch("/api/tournament/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
          },
          body: `{
              "name": ${tournamentName ? tournamentName : dataDict.user.id},
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

      selectedPlayersList.forEach((player) => {
          fetch("/api/game/tournament-invitations/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
              },
              body: `{
                  "name": ${users.find((user) => user.id === player).name},
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
      }
      );

      printSuccess(`Tournament created successfully with ${selectedPlayersList.length} players`, "success");
      history.pushState(null, '', "/tournament");
      pageRouting();
  });

    

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
}