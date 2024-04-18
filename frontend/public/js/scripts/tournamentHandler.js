export function tournamentHandler() {
    // Function to generate tournament bracket
    let numPlayers = 8;

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

/*
<div class="container">
  <div class="row">
    <div class="col-md-6">
        <table class="table-condensed" style="width:100%">
          <tr>
            <td class="col-md-5"><div class="input-group"><div class="form-control">Team 1</div><span class="input-group-addon"><span class="badge pull-right">1</span></span></div></td>
            <td class="col-md-2" rowspan="2" style="padding:0px; position:relative; min-width:50px;">
              <div style="border-top: 2px solid #090; border-right: 2px solid #090; width:80%; height:25%; float: left; position:absolute; top:25%;"></div>
              <div style="border-bottom: 2px solid #f00; border-right: 2px solid #f00; width:80%; height:25%; float: left; position:absolute; top:50%;"></div>
              <div style="border-top: 2px solid #090; width: 20%; margin-left: 80%; float: right; position:absolute;"></div>
            </td>
            <td class="col-md-5" rowspan="2"><div class="input-group"><div class="form-control">Team 1</div><span class="input-group-addon"><span class="badge pull-right">0</span></span></div></td>
            <td class="col-md-2" rowspan="4" style="padding:0px; position:relative; min-width:50px;">
              <div style="border-top: 2px solid #090; border-right: 2px solid #090; width:80%; height:25%; float: left; position:absolute; top:25%;"></div>
              <div style="border-bottom: 2px solid #f00; border-right: 2px solid #f00; width:80%; height:25%; float: left; position:absolute; top:50%;"></div>
              <div style="border-top: 2px solid #090; width: 20%; margin-left: 80%; float: right; position:absolute;"></div>
            </td>
            <td class="col-md-5" rowspan="4"><div class="input-group"><div class="form-control">Team 1</div><span class="input-group-addon"><span class="badge pull-right">0</span></span></div></td>
          </tr>
          <tr>
            <td><div class="input-group"><div class="form-control">Team 2</div><span class="input-group-addon"><span class="badge pull-right">0</span></span></div></td>
          </tr>
          <tr>
            <td class="col-md-5"><div class="input-group"><div class="form-control">Team 1</div><span class="input-group-addon"><span class="badge pull-right">1</span></span></div></td>
            <td class="col-md-2" rowspan="2" style="padding:0px; position:relative; min-width:50px;">
              <div style="border-top: 2px solid #090; border-right: 2px solid #090; width:80%; height:25%; float: left; position:absolute; top:25%;"></div>
              <div style="border-bottom: 2px solid #f00; border-right: 2px solid #f00; width:80%; height:25%; float: left; position:absolute; top:50%;"></div>
              <div style="border-top: 2px solid #090; width: 20%; margin-left: 80%; float: right; position:absolute;"></div>
            </td>
            <td class="col-md-5" rowspan="2"><div class="input-group"><div class="form-control">Team 1</div><span class="input-group-addon"><span class="badge pull-right">0</span></span></div></td>
          </tr>
          <tr>
            <td><div class="input-group"><div class="form-control">Team 2</div><span class="input-group-addon"><span class="badge pull-right">0</span></span></div></td>
          </tr>
        </table>
    </div>
  </div>
</div>*/