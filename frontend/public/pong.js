export function initPongGame() {
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
	
	let player1 = { x: 20, y: 100, width: 10, height: 50 }; // Initial position and size for player 1
	let player2 = { x: canvas.width - 30, y: 200, width: 10, height: 50 }; // Initial position and size for player 2
	let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10 }; // Initial position for the ball
	
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
		// Log player1 and player2 coordinates for debugging
		console.log(`Drawing player1 at ${player1.x}, ${player1.y}`);
		console.log(`Drawing player2 at ${player2.x}, ${player2.y}`);
	
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		// Draw player1, player2, and ball
		drawPlayer(player1);
		drawPlayer(player2);
		drawBall(ball);
	}
	
	console.log("Initializing Pong game");

	async function fetchAndUpdateGameState() {
		try {
			const response = await fetch('http://localhost:8000/game/state/');
			const data = await response.json();
			console.log("Fetched coordinates:", data);

			// Update game state with received data
			player1.y = data.player1.y;
			player2.y = data.player2.y;
			ball.x = data.ball.x;
			ball.y = data.ball.y;
	
			console.log(data); // Log to see the fetched data
		} catch (error) {
			console.error('Failed to fetch coordinates:', error);
		}
		
		// Ensure the game state is redrawn after fetching new coordinates
		drawEverything();
	}
	
	// Call fetchAndUpdateGameState at a regular interval or as part of your game loop
	console.log('About to fetch game state...');

	setInterval(fetchAndUpdateGameState, 100000); // Example: Fetch new game state every second
	
	// Optionally, use requestAnimationFrame for smoother animations if you're adjusting the fetch mechanism to be more real-time
	function gameLoop() {
		fetchAndUpdateGameState(); // You might want to adjust this for real-time games
		requestAnimationFrame(gameLoop);
	}
	
	// Start the game loop
	gameLoop();
	
};
