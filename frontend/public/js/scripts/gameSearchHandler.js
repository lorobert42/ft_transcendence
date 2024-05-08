import pageRouting, { dataSave } from "../../changeContent.js";
import { getGames } from "../fetchers/gamesFetcher.js";
import { getParticipations, getTournaments } from "../fetchers/tournamentsFetcher.js";
import { getUsers } from "../fetchers/usersFetcher.js";
import { pageRefreshRate } from "../../changeContent.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";

export async function gameSearchHandler(dataDict = {}) {
    const gameList = document.getElementById("game-list");
    let users = await getUsers();
    let tournaments = await getTournaments();
    let roomsList = await getGames();
    let participations = await getParticipations();


    roomsList = roomsList.filter((room) => room.player1 != null && room.player2 != null);
    roomsList.forEach((room) => {
        room.name = `Gameroom vs ${room.player1 === dataDict.user.user_id ? users.find((user) => user.id === room.player2).name : users.find((user) => user.id === room.player1).name}`;
    });

    roomsList = roomsList.filter((room) => room.game_status === "pending" || room.game_status === "running");

    dataSave.intervalsList.push(setInterval(async () => {
        if(!isLoggedIn())
            return ;
        roomsList = await getGames();
        tournaments = await getTournaments();
        participations = await getParticipations();
        if(!roomsList || !tournaments || !participations)
            return ;
        roomsList = roomsList.filter((room) => room.player1 != null && room.player2 != null);
        roomsList.forEach((room) => {
            room.name = `Gameroom vs ${room.player1 === dataDict.user.user_id ? users.find((user) => user.id === room.player2).name : users.find((user) => user.id === room.player1).name}`;
        });

        roomsList = roomsList.filter((room) => room.game_status === "pending" || room.game_status === "running");

        filterRooms(tournaments, roomsList);
    }, pageRefreshRate));

    function filterRooms(tournamentContent, roomsContent) {
        const input = document.getElementById("game-search").value;
        let filteredRooms = roomsContent.filter((room) => room.name.toLowerCase().includes(input.toLowerCase()));
        let filteredTournaments = tournamentContent.filter((tournament) => tournament.name.toLowerCase().includes(input.toLowerCase()));
        filteredRooms = filteredRooms.concat(filteredTournaments);
        generateTenGameRooms(filteredRooms);
    }

    function generateTenGameRooms(gameRooms) {
        gameList.innerHTML = "";

        let count = 0;

        gameRooms.forEach((gameRoom) => {
            let type = "game";
            if (count >= 10)
                return;
            if (Object.hasOwn(gameRoom, 'has_started')) {
                type = "tournament";
            }
            if (type == "game") {
                if (gameRoom.game_status == "finished" ||
                    (gameRoom.player1 != dataDict.user.user_id &&
                        gameRoom.player2 != dataDict.user.user_id) ||
                    (gameRoom.game_status != "pending" && gameRoom.game_status != "running")) {
                    return;
                }
            } else if (type == "tournament") {
                if (gameRoom.status.toLowerCase() == "canceled" || gameRoom.status.toLowerCase() == "finished") {
                    return;
                }
                let participationInstance = participations.find(part => part.tournament == gameRoom.id);
                if (participationInstance == undefined) return;
                if (gameRoom.status.toLowerCase() != "pending" &&
                    participationInstance.status.toLowerCase() == "pending") {
                    return;
                }
            }
            const gameRoomElement = document.createElement("li");
            gameRoomElement.className = "list-group-item d-flex justify-content-between align-items-center";
            if (type == "game") {
                gameRoomElement.textContent = `Gameroom vs ${(gameRoom.player1 == dataDict.user.user_id ? users.find((user) => user.id === gameRoom.player2).name : users.find((user) => user.id === gameRoom.player1).name)}`;
            } else {
                gameRoomElement.textContent = gameRoom.name;
            }

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            const joinButton = document.createElement('button');
            joinButton.className = 'btn btn-primary btn-sm';
            joinButton.textContent = 'Join';
            joinButton.addEventListener('click', () => {
                if (type == "game") {
                    history.pushState(null, '', '/online');
                    pageRouting({
                        gameId: gameRoom.id,
                        player1: gameRoom.player1,
                        player2: gameRoom.player2,
                    });
                    filterRooms(tournaments, roomsList);
                } else {
                    history.pushState(null, '', '/tournament');
                    pageRouting({
                        tournamentId: gameRoom.id,
                    });
                    filterRooms(tournaments, roomsList);
                }
            });

            buttonContainer.appendChild(joinButton);

            gameRoomElement.appendChild(buttonContainer);

            gameList.appendChild(gameRoomElement);
            count++;
        });
    }

    document.getElementById("game-search").addEventListener("input", ()=>{
        filterRooms(tournaments, roomsList);
    });

    filterRooms(tournaments, roomsList);


    async function updateUsers() {
        users = await getUsers();
    }

    async function updateGames() {
        games = await getGames();
    }

    async function updateTournaments() {
        tournaments = await getTournaments();
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
