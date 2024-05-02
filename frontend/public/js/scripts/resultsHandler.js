import pageRouting from "../../changeContent.js";

export async function resultsHandler(dataDict = {}) {
    if(!dataDict.winner)
    {
        history.pushState(null, '', '/gamesearch');
        pageRouting();
        return ;
    }

    let users = [];
    await updateUsers();

    let winner = document.getElementById('res-winner');
    let player1Score = document.getElementById('res-player1score');
    let player2Score = document.getElementById('res-player2score');

    console.log("DataDict: ", dataDict);
    let u1name = users.find(user => user.id == dataDict.winner).name;
    let u2name = users.find(user => user.id == dataDict.looser).name;

    winner.textContent += `${users.find(user => user.id == dataDict.winner).name}`;
    player1Score.textContent = `${u1name} : ${dataDict.score1}`;
    player2Score.textContent = `${u2name} : ${dataDict.score2}`;
  
    document.getElementById('button-res-home').addEventListener('click', function(e)
    {
        e.preventDefault();
        history.pushState(null, '', '/gamesearch');
        pageRouting();
    });

    async function updateUsers() {
        users = await fetch("/api/user/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }).then((response) => {
            if (response.status === 401) {
                console.error("Unauthorized");
            }
            return response.json();
        }).then((data) => {
            return data;
        }).catch((error) => {
            console.error("Error:", error);
        });
    }
}