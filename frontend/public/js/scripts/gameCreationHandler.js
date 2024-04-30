import pageRouting  from '../../changeContent.js';

export async function gameCreationHandler(dataDict = {}) {
    //fetch all friends
    let authToken = localStorage.getItem('authToken');
    let friends = [];
    let users = [];
    let games = [];

    await updateUsers();
    await updateFriends();

    let playerSelect = document.getElementById("playerSelect");

    let val = 0;
    friends.forEach(friend => {
        console.log(friend);
        let option = document.createElement("option");
        option.value = val++;
        option.text = users.find(user => user.id == friend).name;
        playerSelect.add(option);
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const input = this.value.toLowerCase();
        const options = document.querySelectorAll('#playerSelect option');
    
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const matches = text.includes(input);
            option.style.display = matches ? '' : 'none';
        });
    });

    document.getElementById('gameCreateSubmit').addEventListener('click', async (e) => {
        e.preventDefault();

        if(playerSelect.value == -1) {return ;}

        await updateGames();

    
        let foundGame = false;
        console.log("Games: ", games);
        games.forEach(element => {
            if(foundGame) {return ;}
            if(((element.player1 == dataDict.user.user_id && element.player2 == friends[playerSelect.value]) ||
            (element.player2 == dataDict.user.user_id && element.player1 == friends[playerSelect.value])) &&
            (element.score1 == 0 && element.score2 == 0))
            {
                //redirect to ongoing party
                console.log("Redirecting to ongoing party with id :", element.id);
                console.log("With players: ", dataDict.user.user_id, " and ", friends[playerSelect.value]);
                console.log("compared to ", element.player1, " and ", element.player2);
                history.pushState(null, '', '/online');
                pageRouting({gameId: element.id});
                foundGame = true;
                return ;
            }
        });
        if(foundGame) {return ;}
        //create a new game

        let resultId = 0;
        await fetch("/api/game/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
              'Content-Type': 'application/json',
            },
            body: `{
                "player1": ${dataDict.user.user_id},
                "player2": ${friends[playerSelect.value]},
                "score1": 0,
                "score2": 0
            }`,
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {
            resultId = data.id;
            console.log(data);
          }).catch((error) => {
            console.error("Error:", error);
        });

        //TODO HANDLE GAME NOT FOUND
        console.log("posting invitation")
        let inv = await fetch("/api/game/game-invitations/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
              'Content-Type': 'application/json',
            },
            body: `{
                "id": ${resultId},
                "status": "pending",
                "game": ${resultId},
                "player1": ${dataDict.user.user_id},
                "player2": ${friends[playerSelect.value]}
            }`,
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }
          ).then((data) => {
            return data;
          }).catch((error) => {
            console.error("Error:", error);
        });

        console.log("Result: ", resultId);
        history.pushState(null, '', '/online');
        pageRouting({
          gameId: resultId,
          player1: dataDict.user.user_id,
          player2: friends[playerSelect.value],
          invitationId: inv.id
        });
        return ;
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

    async function updateGames() {
        games = await fetch("/api/game/", {
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