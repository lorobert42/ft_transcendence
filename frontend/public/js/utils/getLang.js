export function getLang() {
  //get language cookie and set it to EN if not set
  const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  let lang = "EN";
  if (cookie) {
    lang = cookie.split("=")[1];
  }
  return lang;
}