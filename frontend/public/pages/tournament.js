import { getLang } from "../js/utils/getLang.js";

export default function tournament() {
  const lang = getLang();

  let langdict = JSON.parse(`
    {
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
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 1</h2>
        <ul id="round1-list" class="list-group">
      </div>
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 2</h2>
        <ul id="round2-list" class="list-group">
        </ul>
      </div>
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 3</h2>
        <ul id="round3-list" class="list-group">
      </div>
    </div>`;
}