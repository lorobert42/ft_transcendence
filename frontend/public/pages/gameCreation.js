export default async function gameCreation() {
    // let currentUser = localStorage.getItem('user_id');
    // let games = await fetch('/api/game/').then(res => res.json());
    // games.forEach(element => {
    //     if((element.player1 == currentUser || element.player2 == currentUser) && 
    //     (element.score1 == 0 && element.score2 == 0))
    //     {
    //         //redirect to ongoing party
    //         return ;
    //     }
    // });
    return `
    <h2>Create Your Game</h2>
    <form id="gameForm">
        <div class="mb-3">
            <label for="playerSelect" class="form-label">Choose a Player:</label>
            <select class="form-select" id="playerSelect">
                <option selected>Choose...</option>
                <option value="1">Player 1</option>
                <option value="2">Player 2</option>
                <option value="3">Player 3</option>
                <!-- Add more players as needed -->
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Create Game</button>
    </form>`;
}