
import pageRouting, { dataSave } from "../../changeContent.js";
import { getGames } from "../fetchers/gamesFetcher.js";
import { getUsers } from "../fetchers/usersFetcher.js";

export async function initPongGame(dataDict = {}) {
    if (!dataDict.gameId) {
        history.pushState(null, '', '/gamesearch');
        pageRouting();
        return;
    }

    const canvas = document.getElementById('pongCanvas');
    const menu = document.getElementById('buttons-container');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    } else {
        console.log('Canvas element found!');
    }

    let gameId = dataDict.gameId;
    let gamesData = await getGames(gameId);
    let gameData = gamesData.find(game => game.id == gameId);
    let users = await getUsers();
    let opponent = users.find(user => user.id == (gameData.player1 == dataDict.user.user_id ? gameData.player2 : gameData.player1));

    // ### Need to change the 0 in the path by the id of the game
    const gameSocket = new WebSocket(
        'wss://' + location.host + `/ws/game/${gameId}/?token=` + localStorage.getItem('authToken')
    );

    dataSave.socketArrayCollector.push(gameSocket);

    const containerDiv = document.createElement('div');
    containerDiv.className = 'row justify-content-center';

    const LeftName = document.createElement('h4');
    if(gameData.player1 == dataDict.user.user_id)
        LeftName.textContent = dataDict.user.name;
    else 
        LeftName.textContent = opponent.name;
    LeftName.className = "text-center col-3";

    console.log(LeftName.textContent);
    
    const RightName = document.createElement('h4');
    if(gameData.player2 == dataDict.user.user_id)
        RightName.textContent = dataDict.user.name;
    else
        RightName.textContent = opponent.name;
    RightName.className = "text-center col-3";

    console.log(RightName.textContent);

    const LeftScore = document.createElement('div');
    LeftScore.textContent = '0';
    LeftScore.id='scoreLeft';
    LeftScore.className = 'card col-3 text-center align-items-center justify-content-center';

    const RightScore = document.createElement('span');
    RightScore.textContent = '0';
    RightScore.id='scoreRight';
    RightScore.className = 'card col-3 text-center align-items-center justify-content-center';

    containerDiv.appendChild(LeftName);
    containerDiv.appendChild(LeftScore);
    containerDiv.appendChild(RightScore);
    containerDiv.appendChild(RightName);

    menu.appendChild(containerDiv);

    let disconnect = false;
    let keyPressed = { "w": false, "s": false };
    let keyMessage = { "w": "UP", "s": "DOWN" };
    function waitConnection() {
        setTimeout(function () {
            if (gameSocket.readyState === 1 && gameSocket.OPEN === 1) {
                document.addEventListener('keydown', eventKeyDown);

                document.addEventListener('keyup', eventKeyUP);

                gameSocket.send(JSON.stringify({
                    'join': 'online',
                }));

                gameSocket.send(JSON.stringify({
                    'start': 'start',
                }));

            } else {
                if (window.location.pathname !== "/online") {
                    disconnect = true;
                    eventClear();
                    return;
                }
                waitConnection();
            }
        }, 5);
    }

    waitConnection();

    if (disconnect)
        return;

    const ctx = canvas.getContext('2d');

    let player1 = { x: 20, y: 100, width: 25, height: 125, score: 0 };
    let player2 = { x: canvas.width - 30, y: 200, width: 25, height: 125, score: 0 };
    let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10 };

    function drawPlayer(player) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.closePath();
    }

    function drawEverything() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer(player1);
        drawPlayer(player2);
        drawBall(ball);
    }


    console.log("Initializing Pong game");

    let data;

    gameSocket.onmessage = function (e) {
        data = JSON.parse(e.data);
    };

    console.log('About to fetch game state...');
    let intervalId = setInterval(UpdateGameState, 16);

    let scoreLeft = document.getElementById('scoreLeft');
    let scoreRight = document.getElementById('scoreRight');

    console.log(scoreLeft);
    console.log(scoreRight);
    
    function UpdateGameState() {
        if (data == "Game Ended") {
            console.log("Game CLEAR");
            clearInterval(intervalId);
            gamePatch();
            return;
        }

        try {
            player1.x = data["P1"]["x"];
            player2.x = data["P2"]["x"];
            player1.y = data["P1"]["y"];
            player2.y = data["P2"]["y"];
            ball.x = data["Ball"]["x"];
            ball.y = data["Ball"]["y"];
            if (data["P1 Score"] != undefined)
                player2.score = data["P2 Score"];

            if (data["P2 Score"] != undefined)
                player1.score = data["P1 Score"];


            if(scoreLeft)
                scoreLeft.textContent = player1.score;
            if(scoreRight)
                scoreRight.textContent = player2.score;

            for (const key in keyPressed) {
                if (keyPressed[key]) {
                    gameSocket.send(JSON.stringify({
                        'move': keyMessage[key],
                    }));
                }
            }

        } catch (error) {
            // console.error('Failed to fetch coordinates:', error);
        }
        if (window.location.pathname !== "/online") {
            clearInterval(intervalId);
            eventClear();
            return;
        }
        drawEverything();
    }

    function gamePatch() {
        let winner = player1.score > player2.score ? dataDict.player1 : dataDict.player2;
        let winnerScore = player1.score > player2.score ? player1.score : player2.score;
        let looser = player1.score < player2.score ? dataDict.player1 : dataDict.player2;
        let looserScore = player1.score < player2.score ? player1.score : player2.score
        eventClear();
        history.pushState(null, '', '/results');
        pageRouting({gameId: gameId});
    }

    function eventKeyUP(e) {
        if (e.key in keyPressed) {
            keyPressed[e.key] = false;
        }
    }

    function eventKeyDown(e) {
        if (e.key in keyPressed) {
            keyPressed[e.key] = true;
            e.preventDefault();
        }
        if (e.key.repeat) {
            return;
        }
    }
    console.log('About to fetch game state...');
    function eventClear() {
        console.log('Closing game socket...');
        //stop events
        document.removeEventListener('keydown', eventKeyDown);
        
        document.removeEventListener('keyup', eventKeyUP);
        keyPressed = { "ArrowUp": false, "ArrowDown": false, "w": false, "s": false };

    }
};
