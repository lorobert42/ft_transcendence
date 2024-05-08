import pageRouting, { dataSave } from "../../changeContent.js";
import { getLang } from "../utils/getLang.js";


export function initPongGame(routerData = {}) {
    const canvas = document.getElementById('pongCanvas');
    const menu = document.getElementById('buttons-container');
    if (!canvas) {
        return;
    }


    const lang = getLang();

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Jeu Local",
            "playfriend": "Jouer contre un ami",
            "playbot": "Jouer contre un bot",
            "botleft": "Bot à Gauche",
            "botright": "Bot à Droite",
            "playerLeft": "Joueur 1",
            "playerRight": "Joueur 2"
        },
        "EN": {
            "title": "Local Room",
            "playfriend": "Play with Friend",
            "playbot": "Play against Bot",
            "botleft": "Bot on Left",
            "botright": "Bot on Right",
            "playerLeft": "Player 1",
            "playerRight": "Player 2"
		},
        "PT": {
            "title": "Sala local",
            "playfriend": "Jogar com amigo",
            "playbot": "Jogar contra Bot",
            "botleft": "Bot à esquerda",
            "botright": "Bot à direita",
            "playerLeft": "Jogador 1",
            "playerRight": "Jogador 2"

		}
    }`);


    if(routerData.localSelection === undefined || routerData.localSelection === null) {

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'row justify-content-between';

        const leftcol = document.createElement('div');
        leftcol.className = 'col-4';

        const buttonStartHuman = document.createElement('button');
        buttonStartHuman.id = 'button-start-human';
        buttonStartHuman.className = 'btn btn-primary btn-lg';
        buttonStartHuman.textContent = langdict[lang]['playfriend'];

        buttonStartHuman.addEventListener('click', () => {
            routerData.localSelection = 'friend';
            history.pushState(null, '', '/localroom');
            pageRouting(routerData);
        });

        const rightcol = document.createElement('div');
        rightcol.className = 'col-4';

        const botStartDropdown = document.createElement('div');
        botStartDropdown.className = 'dropdown show';

        const buttonStartBot = document.createElement('button');
        buttonStartBot.className = 'btn btn-primary btn-lg dropdown-toggle';
        buttonStartBot.setAttribute('type', 'button');
        buttonStartBot.setAttribute('data-bs-toggle', 'dropdown');
        buttonStartBot.setAttribute('aria-expanded', 'false');
        buttonStartBot.textContent = langdict[lang]['playbot'];

        const dropMenu= document.createElement('div');
        dropMenu.className = 'dropdown-menu justify-content-center';
        dropMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');

        const anchorLeft = document.createElement('button');
        anchorLeft.className = 'dropdown-item text-center';
        anchorLeft.textContent = langdict[lang]['botleft'];
        anchorLeft.id = 'botleft';

        anchorLeft.addEventListener('click', () => {
            routerData.localSelection = 'leftBot';
            history.pushState(null, '', '/localroom');
            pageRouting(routerData);
        });

        const anchorRight = document.createElement('button');
        anchorRight.className = 'dropdown-item text-center';
        anchorRight.textContent = langdict[lang]['botright'];
        anchorRight.id = 'botright';

        anchorRight.addEventListener('click', () => {
            routerData.localSelection = 'rightBot';
            history.pushState(null, '', '/localroom');
            pageRouting(routerData);
        });

        dropMenu.appendChild(anchorLeft);
        dropMenu.appendChild(anchorRight);
        botStartDropdown.appendChild(buttonStartBot);
        botStartDropdown.appendChild(dropMenu);
    
        leftcol.appendChild(buttonStartHuman);
        rightcol.appendChild(botStartDropdown);
        buttonDiv.appendChild(leftcol);
        buttonDiv.appendChild(rightcol);
        menu.appendChild(buttonDiv);

    }
    let gameSocket;

    if(routerData.localSelection === undefined || routerData.localSelection === null) {
        gameSocket = new WebSocket(
            'wss://' + location.host + '/ws/game/bot' + routerData.user.user_id + '/?token=' + localStorage.getItem('authToken')
        );
    
        dataSave.socketArrayCollector.push(gameSocket);
    } else {
        gameSocket = new WebSocket(
            'wss://' + location.host + '/ws/game/local' + routerData.user.user_id + '/?token=' + localStorage.getItem('authToken')
        );
    
        dataSave.socketArrayCollector.push(gameSocket);
    }
    
    if(routerData.localSelection !== undefined && routerData.localSelection !== null) {

        const containerDiv = document.createElement('div');
        containerDiv.className = 'row justify-content-center';

        const LeftName = document.createElement('h4');
        if(routerData.localSelection === 'friend') {
            LeftName.textContent = langdict[lang]['playerLeft'];
        } else if (routerData.localSelection === 'leftBot') {
            LeftName.textContent = 'Bot';
        } else if (routerData.localSelection === 'rightBot') {
            LeftName.textContent = routerData.user.name;
        }

        LeftName.className = "text-center col-3";

        
        const RightName = document.createElement('h4');
        if(routerData.localSelection === 'friend') {
            RightName.textContent = langdict[lang]['playerRight'];
        } else if (routerData.localSelection === 'leftBot') {
            RightName.textContent = routerData.user.name;
        } else if (routerData.localSelection === 'rightBot') {
            RightName.textContent = 'Bot';
        }

        RightName.className = "text-center col-3";

    
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

    }

    let scoreLeft = document.getElementById('scoreLeft');
    let scoreRight = document.getElementById('scoreRight');

    let disconnect = false;

    let keyPressed = { "ArrowUp": false, "ArrowDown": false, "w": false, "s": false };
    let keyMessage = { "ArrowUp": "P2_UP", "ArrowDown": "P2_DOWN", "w": "P1_UP", "s": "P1_DOWN" };
    function waitConnection() {
        setTimeout(function () {
            if (gameSocket.readyState === 1 && gameSocket.OPEN === 1) {

                if(routerData.localSelection !== undefined && routerData.localSelection !== null) {
                    document.addEventListener('keydown', eventKeyDown);

                    document.addEventListener('keyup', eventKeyUP);
                    if(routerData.localSelection === 'friend') {
                        startGame('human', 'human');
                    } else if (routerData.localSelection === 'leftBot') {
                        startGame('bot', 'human');
                    } else if (routerData.localSelection === 'rightBot') {
                        startGame('human', 'bot');
                    }

                    let explanationDiv = document.getElementById('explanationDiv');
                    explanationDiv.style.display = 'none';
                } else {
                    startGame('bot', 'bot');
                }

            } else {
                if (window.location.pathname !== "/localroom") {
                    disconnect = true;
                    eventClear();
                    return;
                }
                waitConnection();
            }
        }, 5);
    }
    function startGame(player1Type, player2Type) {
        gameSocket.send(JSON.stringify({
            'join': 'local',
            'player_1_type': player1Type,
            'player_2_type': player2Type,
        }));

        gameSocket.send(JSON.stringify({
            'start': 'start',
        }));
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

    let data;

    gameSocket.onmessage = function (e) {
        data = JSON.parse(e.data);
        if (data["P1 Score"])
        {
            if(data["P1 Score"] > player1.score && scoreLeft) {
                scoreLeft.textContent = data["P1 Score"];
            }
            player1.score = data["P1 Score"];
        }
        if (data["P2 Score"]){
            if(data["P2 Score"] > player2.score && scoreRight) {
                scoreRight.textContent = data["P2 Score"];
            }
            player2.score = data["P2 Score"];
        }
    }


    let intervalId = setInterval(UpdateGameState, 16);

    function UpdateGameState() {
        if (data == "Game Ended") {
            clearInterval(intervalId);

            if(routerData.localSelection === undefined || routerData.localSelection === null) {
                history.pushState(null, '', '/localroom');
                pageRouting(routerData);
            }
            eventClear();
            return;
        }
        if(data != undefined && data != null &&
             data["P1"] != undefined && data["P1"] != null &&
             data["P2"] != undefined && data["P2"] != null &&
             data["Ball"] != undefined && data["Ball"] != null &&
             data["P1"]["x"] && data["P2"]["x"] && data["Ball"]["x"]) {
            try {

                player1.x = data["P1"]["x"];
                player2.x = data["P2"]["x"];
                player1.y = data["P1"]["y"];
                player2.y = data["P2"]["y"];
                ball.x = data["Ball"]["x"];
                ball.y = data["Ball"]["y"];

                for (const key in keyPressed) {
                    if (keyPressed[key]) {
                        gameSocket.send(JSON.stringify({
                            'local': keyMessage[key],
                        }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch coordinates:', error);
            }
        }
        if (window.location.pathname !== "/localroom") {
            clearInterval(intervalId);
            eventClear();
            return;
        }
        drawEverything();
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

    function eventClear() {
        const lang = getLang();

        let langdict = JSON.parse(`{
            "FR": {
                "wins": "a gagné",
                "RestartGame": "Rejouer"    
            },
            "EN": {
                "wins": "wins",
                "RestartGame": "Restart Game"
            },
            "PT": {
                "wins": "vitórias",
                "RestartGame": "Reiniciar o jogo"    
            }
        }`);
    
        document.removeEventListener('keydown', eventKeyDown);
        document.removeEventListener('keyup', eventKeyUP);
        keyPressed = { "ArrowUp": false, "ArrowDown": false, "w": false, "s": false };

        canvas.style.display = 'none';

        let winner;

        if(routerData.localSelection === 'friend') {
            winner = player1.score > player2.score ? 'Player 1' : 'Player 2';
        } else if (routerData.localSelection === 'leftBot') {
            winner = player1.score > player2.score ? 'Bot' : routerData.user.name;
        } else if (routerData.localSelection === 'rightBot') {
            winner = player1.score > player2.score ? routerData.user.name : 'Bot';
        }

        const winnerDiv = document.createElement('h1');
        winnerDiv.className = 'text-center m-5';
        winnerDiv.textContent = `${winner} ${langdict[lang]["wins"]} !`;

        menu.appendChild(winnerDiv);

        const restartButton = document.createElement('button');
        restartButton.className = 'btn btn-primary m-5 btn-lg';
        restartButton.textContent = `${langdict[lang]["RestartGame"]}`;
        restartButton.addEventListener('click', () => {
            history.pushState(null, '', '/localroom');
            pageRouting(routerData);
        });
        menu.appendChild(restartButton);
    }
};
