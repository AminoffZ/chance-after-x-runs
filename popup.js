function saveChance(chance) {
    localStorage.setItem("saved-chance", chance);
    chrome.storage.sync.set({"input-chance": {"chance": chance}});
}

function saveRuns(runs) {
    localStorage.setItem("saved-runs", runs);
    chrome.storage.sync.set({"input-runs": {"runs": runs}});
}

function setCalculationInfo(calculation) {
    if (calculation.match("%")) {
        const color = getColor(parseFloat(calculation.split("%")[0]));
        document.getElementById("chance-info").style.color = `rgb(${color[0]},${color[1]},${color[2]})`;
    }
    document.getElementById("chance-info").innerHTML = calculation;
}

function getChance() {
    return document.getElementById("input-chance").value;
}

function getRuns() {
    return document.getElementById("input-runs").value;
}

function setChance(value) {
    document.getElementById("input-chance").value = value;
}

function setRuns(value) {
    document.getElementById("input-runs").value = value;
}

function calculate() {
    let chance = getChance();
    const runs = getRuns();
    if (chance === "0" || runs === "0") {
        setTimeout(setCalculation, 100);
        return;
    } 
    if (!chance || !runs) {
        setChance("0");
        setRuns("0");
        return "0%";
    }
    if(chance.match("/")) {
        chance = parseFloat(chance.split("/")[0] / parseFloat(chance.split("/")[1]));
    } else {
        chance = parseFloat(chance)/100;
    }
    // 1 - ( ( 1 - chance ) ^ runs )
    let calculation = (1-(Math.pow(1-chance, parseInt(runs))))*100;
    if(!calculation || calculation<0) {
        return "Invalid Input";
    } else if (calculation>100) {
        return "100%"
    } else {
        calculation = calculation.toFixed(3);
    }
    return `${calculation}%`;
}

function setCalculation() {
    const calculation = calculate();
    if (calculation) {
        setCalculationInfo(calculation);
    }
}

function getSaved() {
    chrome.storage.sync.get(['input-chance'], function(result) {
        if (Object.entries(result).length>0) {
            setChance(result["input-chance"]["chance"]);
        } else {
            setChance(null);
        }
    });
    
    chrome.storage.sync.get(['input-runs'], function(result) {
        if (Object.entries(result).length>0) {
            setRuns(result["input-runs"]["runs"]);
        } else {
            setRuns(null);
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
