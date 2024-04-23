export default function gameSearch() {
    return `<div class="row">
        <div class="col-md-6">
            <h1>Pending Games</h1>
            <input type="text" id="game-search" class="form-control mb-3" placeholder="Search Game...">
            <ul id="game-list" class="list-group"></ul>
        </div>
        <div class="col-md-6">
            <h2>Game Creation</h2>
            <ul id="game-create" class="list-group">
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" href="/localroom" class="btn btn-primary" id="create-local-game">Create Local Game</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-remote-game">Create Remote Game</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-ai-game">Create AI Game</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-tournament">Create Tournament</button>
            </ul>
        </div>
    </div>`;
}
