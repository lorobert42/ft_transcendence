export default function gameResults() {
    return `
    <h1 class="text-center">Game Results</h1>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-header">
                        Pong Game
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" id="res-winner">Winner: </h5>
                        <p class="card-text" id="res-player1score">Player 1 Score: </p>
                        <p class="card-text" id="res-player2score">Player 2 Score: </p>
                        <a href="/gamesearch" id="button-res-home" class="btn btn-primary">Back to Games Hub</a>
                    </div>
                </div>
            </div>
        </div>`;
}