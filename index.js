const express = require('express')
const path = require('path')
const hbs = require("express-handlebars");

const app = express()
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'defaultlayout',
    layoutsDir: __dirname + "/layout"
}));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, '/public')));

app.get("/", (req, res) => {
    res.render("index", {
        numbers: digits.numbers,
        symbols: digits.symbols,
    });
})
app.get("/favourites", (req, res) => {
    res.render("favourites");
})
 
var serv = app.listen(process.env.PORT || 80);

var io = require('socket.io')(serv, {});

var sockets = [];

io.on("connection", (socket) => {
    socket.on("generate", (args) => {
        socket.emit("updatePasswords", {
            passwords: generatePasswords(args.options)
        });
    });
});

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
    symbols: [
        '@', '#', '*', '+', '~', '-', '_', '.', ',', ';', ':', '?', '/', '!', '|'
    ],
    symbolsnumbers: [],
    all: [],
};
digits.letters = digits.vowels.concat(digits.consonants);
digits.symbolsnumbers = digits.numbers.concat(digits.symbols);
digits.all = digits.letters.concat(digits.symbolsnumbers);

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