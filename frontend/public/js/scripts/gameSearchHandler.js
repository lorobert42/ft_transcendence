import pageRouting from "../../changeContent.js";

export async function gameSearchHandler(dataDict = {}) {
    const gameList = document.getElementById("game-list");
    let users = [];
    let games = [];
    let tournaments = [];
    await updateUsers();
    await updateGames();
    await updateTournaments();
    console.log("Games :  ", games);
    console.log("Tournaments : ", tournaments);

    let roomsList = await fetch("/api/game/", {
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

    console.log("Rooms list : ", roomsList);

    roomsList.forEach((room) => {
        room.name = `Gameroom vs ${users.find((user) => user.id === room.player1).name}`;
    });

    roomsList = roomsList.filter((room) => room.player1 === dataDict.user.user_id ||
        room.player2 === dataDict.user.user_id);

    console.log("Game rooms : ", roomsList);

    roomsList = roomsList.filter((room) => room.game_status === "pending" || room.game_status === "running");

    console.log("Room list : ", roomsList);
    function filterRooms() {
        const input = document.getElementById("game-search").value;
        let filteredRooms = roomsList.filter((room) => room.name.toLowerCase().includes(input.toLowerCase()));
        filteredRooms = roomsList.filter((room) => room.tournament === null);
        let filteredTournaments = tournaments.filter((tournament) => tournament.name.toLowerCase().includes(input.toLowerCase()));
        filteredTournaments = filteredTournaments.filter((tournament) => tournament.participants.includes(dataDict.user.user_id));
        filteredRooms = filteredRooms.concat(filteredTournaments);
        console.log("Filtered rooms : ", filteredRooms);
        generateTenGameRooms(filteredRooms);
    }

    function generateTenGameRooms(gameRooms) {
        gameList.innerHTML = "";

        let count = 0;

        gameRooms.forEach((gameRoom) => {
            if (count >= 10)
                return;
            if (gameRoom.game_status == "finished" ||
                (gameRoom.player1 != dataDict.user.user_id &&
                    gameRoom.player2 != dataDict.user.user_id) ||
                (gameRoom.game_status != "pending" && gameRoom.game_status != "running")) {
                return;
            }
            count++;
            const gameRoomElement = document.createElement("li");
            gameRoomElement.className = "list-group-item d-flex justify-content-between align-items-center";
            gameRoomElement.innerText = `Gameroom vs ${(gameRoom.player1 == dataDict.user.user_id ? gameRoom.player2 : gameRoom.player1)}`;

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            // Create a button element for joining game
            const joinButton = document.createElement('button');
            joinButton.className = 'btn btn-primary btn-sm';
            joinButton.textContent = 'Join';
            joinButton.addEventListener('click', () => {
                console.log(`Joining ${gameRoom.name}`);
                history.pushState(null, '', '/online');
                pageRouting({
                    gameId: gameRoom.id,
                    player1: gameRoom.player1,
                    player2: gameRoom.player2,
                });
                filterRooms();
            });

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

    async function updateTournaments() {
        tournaments = await fetch("/api/game/tournament/", {
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
