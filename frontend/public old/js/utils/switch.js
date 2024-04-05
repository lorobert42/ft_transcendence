export function switchTextHandler(isOn) {
    let stateText = isOn ? 'Dark' : 'Light';
    document.getElementById("switchState").innerHTML = stateText;
    // document.getElementById("theme-switch").classList.remove(isOn ? 'bg-light' : 'bg-dark');
    // document.getElementById("thene-switch").classList.add(isOn ? 'bg-dark' : 'bg-light');
    [...document.getElementsByClassName("theme-switch")].forEach((element, index, array) => {
        if(element.classList.contains("bg-dark") || element.classList.contains("bg-light")) {
            element.classList.remove(isOn ? 'bg-light' : 'bg-dark');
            element.classList.add(isOn ? 'bg-dark' : 'bg-light');
        }
        if(element.classList.contains("btn-light") || element.classList.contains("btn-dark")) {
            element.classList.remove(isOn ? 'btn-light' : 'btn-dark');
            element.classList.add(isOn ? 'btn-dark' : 'btn-light');
        }
        if(element.classList.contains("text-dark") || element.classList.contains("text-light")) {
            element.classList.remove(isOn ? 'text-dark' : 'text-light');
            element.classList.add(isOn ? 'text-light' : 'text-dark');
        }
    });
}

export function setupSwitch() {
    document.getElementById("flexSwitchCheckDefault").addEventListener("change", function(){
        switchTextHandler(this.checked);
        localStorage.setItem("switchState", this.checked);
    });
    
    window.onload = function() {
        let switchState = localStorage.getItem("switchState") === 'true';
        switchTextHandler(switchState);
    }
}