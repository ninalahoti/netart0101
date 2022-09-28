let words = ["hello", "capybara", "lemon", "llama", "cider", "jajangmyeon", "emerald", "romanesco", "walnut", "hegemony"];

// pick a random word
let maxnum = words.length;
let rand = Math.floor(Math.random() * maxnum);
let word = words[rand];

let wrongcount = 0;
let guesses = [];

// add blanks to html
let wordlength = word.length;
let blanks = "";
for (let i = 0; i < wordlength; i++) {
    blanks += "_";
}
if (document.getElementById("word").innerHTML == "") {
    document.getElementById("word").innerHTML = blanks;
}

// when a key is pressed...
document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    // fill in the blank if the letter is in the word
    if (guesses.includes(name) == false && wrongcount < 6 && document.getElementById("word").innerHTML.includes("_") == true) {
        guesses.push(String(name));
        var newblanks = word;
        for (let i = 0; i < wordlength; i++) {
            if (guesses.includes(word.charAt(i)) == false) {
                newblanks = newblanks.replace(word.charAt(i), "_");
            }
        }
        document.getElementById("word").innerHTML = newblanks;

        // fill in the key on the keyboard
        // make the key text green if the letter is in the word
        // otherwise, make it red
        document.getElementById(String(name)).innerHTML = name;
        if (word.includes(String(name))) {
            document.getElementById(name).style.color = "green";
        } else {
            wrongcount += 1;
            document.getElementById(name).style.color = "red";
        }
    }

    // if the word is complete, show the win message
    if (document.getElementById("word").innerHTML.includes("_") == false) {
        document.getElementById("word").style.color = "green";
        document.getElementById("status").style.color = "green";
        document.getElementById("status").innerHTML = "YOU WIN!";
    }

    // if the letter is not in the word, add to the hangman
    // if there are 6 wrong guesses, show the lose message and the word
    if (wrongcount == 1) {
        document.getElementById("gameline1").innerHTML = "&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;◯";
    } else if (wrongcount == 2) {
        document.getElementById("gameline2").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;";
        document.getElementById("gameline3").innerHTML = "&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╵";
    } else if (wrongcount == 3) {
        document.getElementById("gameline2").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__│&nbsp;&nbsp;";
    } else if (wrongcount == 4) {
        document.getElementById("gameline2").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__│__&nbsp;";
    } else if (wrongcount == 5) {
        document.getElementById("gameline4").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    } else if (wrongcount == 6) {
        document.getElementById("gameline4").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╱ ╲&nbsp;";
        document.getElementById("word").style.color = "red";
        document.getElementById("status").style.color = "red";
        document.getElementById("status").innerHTML = "YOU LOST!";
        document.getElementById("word").innerHTML = word;
    }
  }, false);
