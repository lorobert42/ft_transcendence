
export function initPongGame(dataDict = {}) {
    const canvas = document.getElementById('pongCanvas');
    const scoreZone = document.getElementById('scoreZone');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    } else {
        console.log('Canvas element found!');
    }

    let gameId = dataDict.gameId;

    // ### Need to change the 0 in the path by the id of the game
    const gameSocket = new WebSocket(
        'wss://' + location.host + `/ws/game/online${gameId}/?token=` + localStorage.getItem('authToken')
    );
    

    let keyPressed = {"w": false, "s": false};
    let keyMessage = {"w": "UP", "s": "DOWN"};
    function waitConnection() {
        setTimeout(function() {
            if(gameSocket.readyState === 1 && gameSocket.OPEN === 1) {
                document.addEventListener('keydown', (e) => {
                    if (e.key in keyPressed) {
                        keyPressed[e.key] = true;
                    }
                    if(e.key.repeat) {
                        return;
                    }
                });
                
                document.addEventListener('keyup', (e) => {
                    if (e.key in keyPressed) {
                        keyPressed[e.key] = false;
                    }
                });

                gameSocket.send(JSON.stringify({
                    'join': 'online',
                }));
				// Function to disable start button
				function disableButtons() {
					document.getElementById('button-start').disabled = true;
				}

                document.getElementById('button-start').addEventListener('click', () => {
                    gameSocket.send(JSON.stringify({
                        'start': 'start',
                    }));
					disableButtons(); // Disable both buttons
                });

        } else {
            console.log("waiting to connect");
            waitConnection();
        }
        }, 5);
    }


    console.log("Connected");
    waitConnection();


        
    const ctx = canvas.getContext('2d');
    
    let player1 = { x: 20, y: 100, width: 25, height: 125, score: 0 }; 
    let player2 = { x: canvas.width - 30, y: 200, width: 25, height: 125, score:0 }; 
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
    
    gameSocket.onmessage = function(e) {
        data = JSON.parse(e.data);
    };
    
    console.log('About to fetch game state...');
    let intervalId = setInterval(UpdateGameState, 16);
    
    function UpdateGameState() {
        try {
            if(data == "Game Ended")
            {
                console.log("Game CLEAR");
                gamePatch();
               clearInterval(intervalId);
               return ;
            }
            player1.x = data["P1"]["x"];
            player2.x = data["P2"]["x"];
            player1.y = data["P1"]["y"];
            player2.y = data["P2"]["y"];
            ball.x = data["Ball"]["x"];
            ball.y = data["Ball"]["y"];
            player1.score = data["P1 Score"];
            player2.score = data["P2 Score"];

            scoreZone.innerHTML = `Score : ${player1.score} - ${player2.score}`;

            for (const key in keyPressed) {
                if (keyPressed[key]) {
                    gameSocket.send(JSON.stringify({
                        'move': keyMessage[key],
                    }));
                }
            }

        } catch (error) {
            console.error('Failed to fetch coordinates:', error);
        }
        if(window.location.pathname !== "/online") 
            return ;
        drawEverything();
    }

    function gamePatch() {
        fetch(`/api/game/${gameId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: `{
                "score1": ${player1.score},
                "score2": ${player2.score}
            }`,
        })
            .then((response) => {
                if (response.status === 401) {
                    console.error('Unauthorized');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // function gameLoop() {
    //     fetchAndUpdateGameState();
    //     requestAnimationFrame(gameLoop);
    //     console.log('Game loop running');
    // }
};
