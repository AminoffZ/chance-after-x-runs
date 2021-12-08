function saveChance(chance) {
    localStorage.setItem("saved-chance", chance);
    chrome.storage.sync.set({"input-chance": {"chance": chance}});
}

function saveRuns(runs) {
    localStorage.setItem("saved-runs", runs);
    chrome.storage.sync.set({"input-runs": {"runs": runs}});
}

function setCalculationInfo(calculation) {
    document.getElementById("chance-info").innerHTML = calculation;
}

function getChance() {
    return document.getElementById("input-chance").value;
}

function getRuns() {
    return document.getElementById("input-runs").value;
}

function calculate() {
    let chance = getChance();
    const runs = getRuns();
    if (chance === "0" || !runs === "0") {
        setTimeout(setCalculation, 100);
        return;
    }
    if(chance.match("/")) {
        chance = parseFloat(chance.split("/")[0] / parseFloat(chance.split("/")[1]));
    } else {
        chance = parseFloat(chance)/100;
    }
    // 1 - ( ( 1 - chance ) ^ runs )
    const calculation = (1-(Math.pow(1-chance, parseInt(runs))))*100;
    if(!calculation || calculation<0) {
        return "Invalid Input";
    } else if (calculation>100) {
        return "100%"
    }
    return `${calculation}%`;
}

function setCalculation() {
    const calculation = calculate();
    setCalculationInfo(calculation);
}

function getSaved() {
    chrome.storage.sync.get(['input-chance'], function(result) {
        const inputChance = document.getElementById("input-chance");
        if (Object.entries(result).length>0) {
            inputChance.value = result["input-chance"]["chance"];
        } else {
            inputChance.value = 0;
        }
    });
    
    chrome.storage.sync.get(['input-runs'], function(result) {
        const inputRuns = document.getElementById("input-runs");
        if (Object.entries(result).length>0) {
            inputRuns.value = parseInt(result["input-runs"]["runs"]);
        } else {
            inputRuns.value = 0;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getSaved();
    setCalculation();
    document.getElementById("calculate-chance-button").addEventListener("click", function() {
        setCalculation();
        saveChance(getChance());
        saveRuns(getRuns());
    });
});
