import pageRouting from "../../changeContent.js";

export async function gameSearchHandler(dataDict = {}) {
    const gameList = document.getElementById("game-list");
    let users = [];
    let games = [];
    await updateUsers();
    await updateGames();
    console.log("Games :  ", games);

    let roomsList = await fetch("/api/game/game-invitations/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

    
    roomsList.forEach((room) => {
        room.name = `Gameroom by ${users.find((user) => user.id === room.player1).name}`;
    });
    
    roomsList = roomsList.filter((room) => room.player1 === dataDict.user.user_id ||
    room.player2 === dataDict.user.user_id);
    
    console.log("Room list : ", roomsList);
    function filterRooms() {
        const input = document.getElementById("game-search").value;
        let filteredRooms = roomsList.filter((room) => room.name.toLowerCase().includes(input.toLowerCase()));
        generateTenGameRooms(filteredRooms);
    }

    function generateTenGameRooms(gameRooms) {
        gameList.innerHTML = "";

        let count = 0;

        gameRooms.forEach((gameRoom) => {
            if(count >= 10)
                return;
            let game = games.find((game) => game.id === gameRoom.game);
            if(game == undefined)
                return;
            if(game.is_archived || 
                (gameRoom.player1 != dataDict.user.user_id && 
                    gameRoom.player2 != dataDict.user.user_id) || 
                        (gameRoom.status != "pending" && gameRoom.status != "running")){
                return;
            }
            count++;
            const gameRoomElement = document.createElement("li");
            gameRoomElement.className = "list-group-item d-flex justify-content-between align-items-center";
            gameRoomElement.innerText = gameRoom.name;
    
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");
    
            // Create a button element for joining game
            const joinButton = document.createElement('button');
            joinButton.className = 'btn btn-primary btn-sm';
            joinButton.textContent = 'Join';
            joinButton.addEventListener('click', () => {
                console.log(`Joining ${gameRoom.name}`);
                fetch(`/api/game/game-invitations/${gameRoom.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: `{
                        "status": "running",
                        "player1": ${gameRoom.player1},
                        "player2": ${gameRoom.player2},
                        "game": ${gameRoom.game}
                    }`,
                }).then((response) => {
                    if (response.status === 401) {
                        console.error("Unauthorized");
                    }
                    return response.json();
                }
                ).then((data) => {
                    history.pushState(null, '', '/online');
                    pageRouting({
                        gameId: gameRoom.game, 
                        player1: gameRoom.player1,
                        player2: gameRoom.player2,
                        invitationId: gameRoom.id
                    });
                }).catch((error) => {
                    console.error("Error:", error);
                });
                filterRooms();
            });
    
            //create deny button
            const denyButton = document.createElement('button');
            denyButton.className = 'btn btn-danger btn-sm';
            denyButton.textContent = 'Deny';
            denyButton.addEventListener('click', () => {
                console.log(`Denying ${gameRoom.name}`);
                fetch(`/api/game/game-invitations/${gameRoom.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: `{
                        "status": "declined",
                        "player1": ${gameRoom.player1},
                        "player2": ${gameRoom.player2},
                        "game": ${gameRoom.game}
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
                filterRooms();
            });
    
            buttonContainer.appendChild(denyButton);
    
            buttonContainer.appendChild(joinButton);
    
            gameRoomElement.appendChild(buttonContainer);
    
            gameList.appendChild(gameRoomElement);
        });
    }

    document.getElementById("game-search").addEventListener("input", filterRooms);

    filterRooms();


    async function updateUsers() {
        users = await fetch("/api/user/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

    document.getElementById("create-local-game").addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, '', "/localroom");
        pageRouting();
    });

    document.getElementById("create-remote-game").addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, '', "/onlineCreation");
        pageRouting();
    });

    document.getElementById("create-tournament").addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, '', "/tournamentCreation");
        pageRouting();
    });
}
