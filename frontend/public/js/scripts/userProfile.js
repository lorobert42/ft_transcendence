import pageRouting, { dataSave } from '../../changeContent.js'
import { getGames } from '../fetchers/gamesFetcher.js';
import { disableMfa, requestMfaActivation } from '../fetchers/mfaFetcher.js';
import { getRefreshToken, getUserInfo, getUsers } from '../fetchers/usersFetcher.js';
import { decodeJWT } from '../utils/tokenHandler.js';

export async function userProfileModule(dataDict = {}) {
  const setUserProfile = (user) => {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    if (user.avatar != '')
      document.getElementById("avatar").src = "media/" + user.avatar;
  }

  const otpEnableRequest = async (user, password) => {
    await requestMfaActivation(user.email, password);
  };

  const otpDisableRequest = async (user, password, otp) => {
    await disableMfa(user.email, password, otp);
  };

  const showOtpOption = async (user) => {
    const otpEnable = document.getElementById("otpEnable");
    otpEnable.classList.add("d-none");
    const otpDisable = document.getElementById("otpDisable");
    otpDisable.classList.add("d-none");

    if (user.otp_enabled === false || dataSave.user_has_otp === false) {
      otpEnable.classList.remove("d-none");
      const otpForm = document.getElementById("otpForm");
      if (otpForm) {
        otpForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("otpEnablePassword").value;
          otpEnableRequest(user, password);
        });
      } else {
        console.error("Enable form not found at init time.");
      }
    } else if (user.otp_enabled === true && dataSave.user_has_otp === true){
      otpDisable.classList.remove("d-none");
      const otpDisableForm = document.getElementById("otpDisableForm");
      if (otpDisableForm) {
        otpDisableForm.addEventListener("submit", async function (event) {
          event.preventDefault();
          const password = document.getElementById("otpDisablePassword").value;
          const otp = document.getElementById("otp").value;
          await otpDisableRequest(user, password, otp);
          await getRefreshToken();
          history.pushState({}, '', '/profile');
          pageRouting();
        });
      } else {
        console.error("Disable form not found at init time.");
      }
    }
  };

  const init = (data) => {
    const updateButton = document.getElementById("update-profile");
    updateButton.addEventListener("click", function (event) {
      event.preventDefault();
      history.pushState({}, '', '/update');
      pageRouting(dataDict);
    });
    setUserProfile(data.user);
    showOtpOption(data.user);
  };

  init(dataDict);

  let historyList = document.getElementById("historyList");
  let userList = await getUsers();
  let historyRequest = await getGames();
  let wins = 0;
  let losses = 0;

  historyRequest.forEach((element) => {
    if (element.game_status == "finished") {
      if (element.score1 > element.score2 && element.player1 == dataDict.user.user_id) {
        wins++;
      } else if (element.score1 < element.score2 && element.player1 == dataDict.user.user_id) {
        losses++;
      } else if (element.score1 < element.score2 && element.player2 == dataDict.user.user_id) {
        wins++;
      } else if (element.score1 > element.score2 && element.player2 == dataDict.user.user_id) {
        losses++;
      }
    }
  });

  document.getElementById("wins").textContent = wins;
  document.getElementById("losses").textContent = losses;
  document.getElementById("played").textContent = wins + losses;

  displayItem(filterItems(historyRequest));

  function filterItems(items) {
    let historySearch = document.getElementById("historySearch");
    let filteredItems = items.filter((item) => { 
      return item.player1 != null && item.player2 != null;
    });
    filteredItems = filteredItems.filter((item) => {
      return userList.filter((user) => user.id == item.player1)[0].name.toLowerCase().includes(historySearch.value.toLowerCase()) ||
        userList.filter((user) => user.id == item.player2)[0].name.toLowerCase().includes(historySearch.value.toLowerCase())
    });
    filteredItems = filteredItems.filter((item) => {
      return item.game_status == "finished";
    });
    filteredItems.sort((a, b) => {
      return new Date(b.start_time) - new Date(a.start_time);
    });
    return filteredItems;
  }

  historySearch.addEventListener("input", function () {
    displayItem(filterItems(historyRequest));
  }
  );


  function displayItem(items) {
    historyList.innerHTML = "";
    let count = 0;
    items.forEach((element) => {
      if (count >= 10)
        return;
      count++;

      let card = document.createElement("div");
      card.className = "card md-col-2";
      let cardBody = document.createElement("div");
      cardBody.className = "card-body";
      let cardTitle = document.createElement("p");
      cardTitle.className = "card-text";
      let date = new Date(element.start_time);
      cardTitle.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
      let cardText = document.createElement("h3");
      cardText.className = "card-title";
      let player1 = userList.filter((user) => user.id == element.player1)[0].name;
      let player2 = userList.filter((user) => user.id == element.player2)[0].name;
      cardText.textContent = `${player1} vs ${player2}`;
      let cardScore = document.createElement("p");
      cardScore.className = "card-text";
      cardScore.textContent = `${element.score1} - ${element.score2}`;
      cardBody.appendChild(cardText);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardScore);
      card.appendChild(cardBody);
      historyList.appendChild(card);

    });
  }
}
