import pageRouting from "../../changeContent.js";

export function gameSearchHandler() {
    const gameList = document.getElementById("game-list");
    //TODO: retrieve game rooms
    let roomsList = [{name: "Game Room 1", players: 2}, {name: "Game Room 2", players: 1}];


    function filterRooms() {
        const input = document.getElementById("game-search").value;
        let filteredRooms = roomsList.filter((room) => room.name.toLowerCase().includes(input.toLowerCase()));
        generateTenGameRooms(filteredRooms);
    }

    function generateTenGameRooms(gameRooms) {
        gameList.innerHTML = "";

        gameRooms.forEach((gameRoom) => {
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
            });
    
            //create deny button
            const denyButton = document.createElement('button');
            denyButton.className = 'btn btn-danger btn-sm';
            denyButton.textContent = 'Deny';
            denyButton.addEventListener('click', () => {
                console.log(`Denying ${gameRoom.name}`);
            });
    
            buttonContainer.appendChild(denyButton);
    
            buttonContainer.appendChild(joinButton);
    
            gameRoomElement.appendChild(buttonContainer);
    
            gameList.appendChild(gameRoomElement);
        });

    }

    document.getElementById("game-search").addEventListener("input", filterRooms);

    filterRooms();

    document.getElementById("create-local-game").addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, '', "/localroom");
        pageRouting();
    });
}
