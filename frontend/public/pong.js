
export function initPongGame() {
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    } else
    {
        console.log('Canvas element found!');
    }

    const ctx = canvas.getContext('2d');
    
    let player1 = { x: 20, y: 100, width: 10, height: 50 }; 
    let player2 = { x: canvas.width - 30, y: 200, width: 10, height: 50 }; 
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
        console.log(`Drawing player1 at ${player1.x}, ${player1.y}`);
        console.log(`Drawing player2 at ${player2.x}, ${player2.y}`);
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        drawPlayer(player1);
        drawPlayer(player2);
        drawBall(ball);
    }
    
    console.log("Initializing Pong game");

    async function fetchAndUpdateGameState() {
        try {
            const response = await fetch('https://localhost:8080/api/game/state/', {
                mode: "cors",
                //mode: "same-origin",
            });
            const data = await response.json();
            console.log("Fetched coordinates:", data);
			console.log("Fetched coordinates:", JSON.stringify(data, null, 2));

			player1.x = data.player1.x;
			player1.y = data.player1.y;
			player2.x = data.player2.x;
			player2.y = data.player2.y;
			ball.x = data.ball.x;
			ball.y = data.ball.y;

            console.log(data);
        } catch (error) {
            console.error('Failed to fetch coordinates:', error);
        }
        
        drawEverything();
    }

    console.log('About to fetch game state...');
    setInterval(fetchAndUpdateGameState, 100);
    // fetchAndUpdateGameState();
    function gameLoop() {
        fetchAndUpdateGameState();
        requestAnimationFrame(gameLoop);
        console.log('Game loop running');
    }
    // gameLoop();    
};