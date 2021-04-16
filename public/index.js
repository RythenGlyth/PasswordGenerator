document.getElementById("genBtn").addEventListener("click", () => {
    var options = {};
    Array.from(document.getElementById("optionsForm").children).forEach((option) =>  {
        if(option.type == "checkbox") {
            options[option.name] = option.checked;
        } else {
            options[option.name] = option.value;
        }
    });
    socket.emit("generate", {options});
});

document.getElementById("cleaBtn").addEventListener("click", () => {
    document.getElementById("passwordlist").innerHTML = "";
});

socket.on("updatePasswords", (args) => {
    args.passwords.forEach(password => {
        addPasswordListEntry(password);
    });
});

document.addEventListener("click", (event) => {
    if(event.toElement.classList.contains("copyBtn")) {
        document.execCommand("copy");
        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(event.toElement.parentElement.parentElement.getElementsByClassName("textTd")[0]);

        var oldrange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");
        selection.removeAllRanges();
        if(oldrange) selection.addRange(oldrange);

        event.toElement.innerText = "Copied";

        setTimeout(() => {
            event.toElement.innerText = "Copy";
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