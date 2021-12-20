function saveChance(chance) {
    chrome.storage.sync.set({"input-chance": {"chance": chance}});
}

function saveRuns(runs) {
    chrome.storage.sync.set({"input-runs": {"runs": runs}});
}

function setCalculationInfo(calculation) {
    if (calculation.match("%")) {
        const color = getColor(parseFloat(calculation.split("%")[0]));
        document.getElementById("chance-info").style.color = `rgb(${color[0]},${color[1]},${color[2]})`;
    }
    document.getElementById("chance-info").textContent = calculation;
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

function removeCommas(text) {
    return text.replaceAll(",","");
}

function formatChance(chance) {
    let formatChance = chance;
    if (formatChance.match("/")) {
        if (formatChance.match(",")) {
            formatChance = removeCommas(formatChance);
        }
        formatChance = parseFloat(formatChance.split("/")[0] / parseFloat(formatChance.split("/")[1]));
    } else if (formatChance.match("e")) {
        if(formatChance.match(".")) {
            formatChance = formatChance.replace(",",".");
        }
        formatChance = parseFloat(formatChance.split("e-")[0]) / Math.pow(10, parseInt(formatChance.split("e-")[1]));
    } else if (formatChance.match(",")) {
        formatChance = parseFloat(formatChance.replace(",","."))/100;
    } else {
        formatChance = parseFloat(formatChance)/100;
    }
    return formatChance;
}

function formatRuns(runs) {
    let formatRuns = runs;
    if (formatRuns.match(",")) {
        formatRuns = removeCommas(formatRuns);
    }
    return formatRuns;
}

function calculate() {
    let chance = getChance();
    let runs = getRuns();
    if (!chance || chance === "0" ||
        !runs   || runs   === "0") {
        return "0%";
    }
    chance = formatChance(chance);
    runs = formatRuns(runs);
    // 1 - ( ( 1 - chance ) ^ runs )
    let calculation = (1-(Math.pow(1-chance, parseFloat(runs))))*100;
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

function getSavedRuns() {
    chrome.storage.sync.get(['input-runs'], function(result) {
        if (Object.entries(result).length>0) {
            setRuns(result["input-runs"]["runs"]);
        }
        startApp();
    });
}

function getSavedChance() {
    chrome.storage.sync.get(['input-chance'], function(result) {
        if (Object.entries(result).length>0) {
            setChance(result["input-chance"]["chance"]);
        }
        getSavedRuns();
    });
}

function getSaved() {
    getSavedChance();
}

function startApp() {
    setCalculation();
    document.getElementById("calculate-chance-button").addEventListener("click", function() {
        setCalculation();
        saveChance(getChance());
        saveRuns(getRuns());
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getSaved();    
});
