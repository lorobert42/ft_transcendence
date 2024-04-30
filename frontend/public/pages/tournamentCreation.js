export default function tournamentCreation() {
    return `
    <div class="text-center">
        <h2>Create Your Tournament</h2>
        <p>Choose 3 or 7 players to participate in the tournament</p>
        <div class="row">
            <div class="col-md-5">
                <h2>Available Players</h2>
                <input type="text" id="available-search" class="form-control mb-3" placeholder="Search for players...">
                <ul class="list-group" id="availablePlayers"></ul>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <h2>&rarr; &larr;</h2>
            </div>
            <div class="col-md-5">
                <h2>Selected Players</h2>
                <ul class="list-group" id="selectedPlayers"></ul>
            </div>
        </div>
        <div class="mt-4">
            <input type="text" id="tournament-name" class="form-control mb-3" placeholder="Tournament Name">
            <button id="create-tournament" class="btn btn-success">Create Tournament</button>
        </div>
    </div>`;
}