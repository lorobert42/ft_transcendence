export function tournamentHandler() {
    // Function to generate tournament bracket
    function generateBracket(numPlayers) {
        const bracketContainer = document.getElementById('bracket');
        bracketContainer.innerHTML = `<div class="container">
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
      </div>`; // Clear previous content

    }

    // Example usage:
    const numPlayers = 8; // Change this to adjust the number of players
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