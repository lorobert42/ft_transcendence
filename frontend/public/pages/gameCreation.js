export default function gameCreation() {
    return `
    <div class="text-center">
    <h2>Create Your Game</h2>
    <form id="gameForm">
        <div class="mb-3">
            <label for="playerSelect" class="form-label">Choose a Player:</label>
            <input class="form-control mb-1" type="text" id="searchInput" placeholder="Search player...">
            <select class="form-select" id="playerSelect" size="5">
            </select>
        </div>
        <button type="button" id="gameCreateSubmit" class="btn btn-primary">Create Game</button>
    </form>
    </div>`;
}