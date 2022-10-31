document.getElementById("genBtn").addEventListener("click", () => {
    var options = {};
    Array.from(document.getElementById("optionsForm").children).forEach((option) =>  {
        if(option.type == "checkbox") {
            options[option.name] = option.checked;
        } else {
            options[option.name] = option.value;
        }
    });
    generatePasswords(options).forEach(password => {
        addPasswordListEntry(password);
    });
});

document.getElementById("cleaBtn").addEventListener("click", () => {
    document.getElementById("passwordlist").innerHTML = "";
});

document.addEventListener("click", (event) => {
        console.log(event)
    if(event.target && event.target.classList.contains("copyBtn")) {
        document.execCommand("copy");
        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(event.target.parentElement.parentElement.getElementsByClassName("textTd")[0]);

        var oldrange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");
        selection.removeAllRanges();
        if(oldrange) selection.addRange(oldrange);

        event.target.innerText = "Copied";

        setTimeout(() => {
            event.target.innerText = "Copy";
        }, 2 * 1000);

    }
});

function addPasswordListEntry(text) {
    var passwordListEntry = document.createElement("tr");

    var copyBtnTd = document.createElement("td");
    var copyBtn = document.createElement("button");
    copyBtn.classList.add("copyBtn");
    copyBtn.innerText = "Copy";
    copyBtnTd.appendChild(copyBtn);

    var textTd = document.createElement("td");
    textTd.classList.add("textTd");
    textTd.innerText = text;

    passwordListEntry.appendChild(copyBtnTd);
    passwordListEntry.appendChild(textTd);

    document.getElementById("passwordlist").appendChild(passwordListEntry);
}

const digits = {
    vowels: [
        'a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U',
    ],
    consonants: [
        'b', 'B', 'c', 'C', 'd', 'D', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z',
    ],
    letters: [],
    numbers: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    ],
    get symbols() { return document.getElementById("syms").value.split("") },
    /*[
        '@', '#', '*', '+', '~', '-', '_', '.', ',', ';', ':', '?', '/', '!', '|'
    ],*/
};
digits.letters = digits.vowels.concat(digits.consonants);

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateSpeakablePasswords(length, numbers, symbols, suffixLengthMin, suffixLengthMax, lastSymbol) {
    var suffixLength = (numbers || symbols) ? (Math.floor(Math.random() * (1 + suffixLengthMax - suffixLengthMin)) + suffixLengthMin) : 0;
    var result = "";
    while(result.length < length - suffixLength) {
        var toAdd;
        if(Math.floor(Math.random() * 2) == 1) {
            toAdd = randomFromArray(digits.vowels) + randomFromArray(digits.consonants);
        } else {
            toAdd = randomFromArray(digits.consonants) + randomFromArray(digits.vowels);
        }

        result += toAdd;
    }
    result = result.substring(0, length - suffixLength);
    var chars = [];
    if(numbers) chars = chars.concat(digits.numbers);
    if(symbols && !lastSymbol) chars = chars.concat(digits.symbols);
    while(result.length < length - (lastSymbol ? 1 : 0)) {
        var toAdd;
        toAdd = randomFromArray(chars);
        result += toAdd;
    }

    if(lastSymbol) {
        result += randomFromArray(digits.symbols);
    }

    return result.substring(0, length);
}

function generateNormalPasswords(length, numbers, symbols) {
    var chars = digits.letters;
    if(numbers) chars = chars.concat(digits.numbers);
    if(symbols) chars = chars.concat(digits.symbols);
    var result = "";
    for(var i = 0; i < length; i++) {
        result += randomFromArray(chars);
    }
    return result;
}

function generatePasswords(options) {
    console.log(options);
    if(!options.length) options.length = 1;
    if(options.length < 1) options.length = 1;
    if(options.length > 100) options.length = 100;

    if(!options.count) options.count = 1;
    if(options.count < 1) options.count = 1;
    if(options.count > 100) options.count = 100;

    var passwords = [];
    for(var i = 0; i < options.count; i++) {
        var password = "";
        if(options.speakable) {
            password += generateSpeakablePasswords(options.length, options.numbers, options.symbols, options.suffixLengthMin ? 
                parseInt(options.suffixLengthMin) : 1, options.suffixLengthMax ? parseInt(options.suffixLengthMax) : 5, options.lastSymbol);
        } else {
            password += generateNormalPasswords(options.length, options.numbers, options.symbols);
        }
        if(options.allLowerCase) {
            password = password.toLowerCase();
        }
        if(options.firstUpperCase) {
            password = password.charAt(0).toUpperCase() + password.substring(1);
        }
        passwords.push(password);
    }
    return passwords;
}