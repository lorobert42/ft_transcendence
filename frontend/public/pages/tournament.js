export default function tournament() {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "round": "Tour",
            "tournament": "Tournois"
        },
        "EN": {
            "round": "Round",
            "tournament": "Tournament"
        },
        "PT": {
            "round": "Rodada",
            "tournament": "Torneio"
        }
    }`);
    return `
    <h1>${langdict[lang]['tournament']}</h1>
    <div class="row">
      <div class="col-md-3">
        <h2>${langdict[lang]['round']} 1</h2>
        <ul id="round1-list" class="list-group">
      </div>
      <div class="col-md-3">
        <h2>${langdict[lang]['round']} 2</h2>
        <ul id="round2-list" class="list-group">
        </ul>
      </div>
      <div class="col-md-3">
        <h2>${langdict[lang]['round']} 3</h2>
        <ul id="round3-list" class="list-group">
      </div>
      <div class="col-md-3">
        <h2>${langdict[lang]['round']} 4</h2>
        <ul id="round4-list" class="list-group">
        </ul>
      </div>
    </div>`;
}