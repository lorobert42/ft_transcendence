export function tournamentHandler() {
  
  
}

function generateBrackets(numPlayers) {
    const roundsValues = ((2*numPlayers)-1);
    const round1Bracket = document.getElementById('round1-list');
    const round2Bracket = document.getElementById('round2-list');
    const round3Bracket = document.getElementById('round3-list');
    const round4Bracket = document.getElementById('round4-list');

    function generateBracket(numPlayers) {
        round1Bracket.innerHTML = ``; // Clear previous content
        round2Bracket.innerHTML = ``; // Clear previous content
        round3Bracket.innerHTML = ``; // Clear previous content
        round4Bracket.innerHTML = ``; // Clear previous content

        // Generate Round 1
        for(let i = 0; i < roundsValues; i++) {
          const li = document.createElement('li');
          li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
          
          if(i %2 == 0)
          {
            li.innerText = "User";
            const span = document.createElement('span');
            span.className = "badge text-bg-primary rounded-pill";
            span.innerText = "0";
            li.appendChild(span);
          }
          else
            li.innerText = "";

    
          
          round1Bracket.appendChild(li);
        }

        // Generate Round 2
        for(let i = 0; i < roundsValues; i++) {
          const li = document.createElement('li');
          li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
          
          if((i%4)-1 == 0)
          {
            li.innerText = "User";
            const span = document.createElement('span');
            span.className = "badge text-bg-primary rounded-pill";
            span.innerText = "0";
            li.appendChild(span);
          }
          else
            li.innerText = "";
          round2Bracket.appendChild(li);
        }

        // Generate Round 3
        for(let i = 0; i < roundsValues; i++) {
          const li = document.createElement('li');
          li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
          if((i%8)-3 == 0)
          {
            li.innerText = "User";
            const span = document.createElement('span');
            span.className = "badge text-bg-primary rounded-pill";
            span.innerText = "0";
            li.appendChild(span);
          }
          else
            li.innerText = "";
          round3Bracket.appendChild(li);
        }

        // Generate Round 4
        for(let i = 0; i < roundsValues; i++) {
          const li = document.createElement('li');
          li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
          if((i%16)-7 == 0)
            li.innerText = "User";
          else
            li.innerText = "";
          round4Bracket.appendChild(li);
        }

    }

    // Example usage:
    generateBracket(numPlayers);
}