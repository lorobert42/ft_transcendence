import { switchTextHandler } from "../utils/switch.js";

export default function() {
    if(localStorage.getItem("switchState") != null) {
        switchTextHandler(localStorage.getItem("switchState") === 'true');
    }
}