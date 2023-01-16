//console.log(keyBoardButtons);
//tastiera a video realizzata sul layout
//per le parole da indovinare proviamo ad usare una api swapi
//quando ho finito la partita avro un button che resetta

/*
keyBoardButtons.map((keyBoardButton) => {
  console.log(keyBoardButton.letter);
});
*/

const keyBoardSection = document.getElementById("keyboard");
const hangWordContainer = document.querySelector(".hang-word");

async function createKeyBoard(keyBoard) {
  keyBoard.forEach((key) => {
    const newButton = document.createElement("button");
    newButton.classList.add("btn");
    const buttonLetter = document.createTextNode(key.letter);
    newButton.appendChild(buttonLetter);
    keyBoardSection.appendChild(newButton);
  });
    const secretWords = await getSecretWords();
    const letterPressed = keyPressed(secretWords);

}

function keyPressed(randomSecretWord) {
  const buttons = document.querySelectorAll(".btn");
  let letterPressed = "";
  const lettersPressed = [];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      letterPressed = button.textContent;
      lettersPressed.push(letterPressed);
        button.disabled = true;
        console.log("rnd",randomSecretWord);
        const isGuessed = checkIfGuessed(randomSecretWord, letterPressed);
        if (isGuessed) {
            const paragraphsLowDash = document.querySelectorAll('p');
            console.log(paragraphsLowDash);
            let revealWord = '';
            paragraphsLowDash.forEach((paragraph, i) => {
              //devo sostiuire il contenuto della p lowdash _ con la lettera indovinata se indovinata!
              if (letterPressed === randomSecretWord[i] && paragraph.innerHTML !== letterPressed) {
                paragraph.innerHTML = randomSecretWord[i]
              }
            })
             
        } else {
            console.log("ehila");
        }
    });
  });
    return letterPressed;
}

async function getSecretWords() {
  const secretWords = [];
  await fetch("https://swapi.dev/api/planets")
    .then((response) => response.json())
    .then((data) => {
      data.results.map((planet) => {
        secretWords.push(planet.name.toUpperCase());
      });
    });
    console.log("secret words array: ", secretWords);
    const randomSecretWord = randomlyChosenWord(secretWords);
    return randomSecretWord;
}

function randomlyChosenWord(secrets) {
  const randomNumberIndex = Math.floor(Math.random() * secrets.length);
    console.log("random secret word: ", secrets[randomNumberIndex]);
    
    createHangBoard(secrets[randomNumberIndex]);
    return secrets[randomNumberIndex];
}

function createHangBoard(randomSecretWord) {
    const splittedWord = randomSecretWord.split("");
    console.log("splitted",splittedWord);
    splittedWord.forEach((letter) => {
        const newVoidLowDash = document.createElement("p");
        newVoidLowDash.classList.add("low-dash");
        const pLowDash = document.createTextNode("_");
        newVoidLowDash.appendChild(pLowDash);
        hangWordContainer.appendChild(newVoidLowDash);
    });
}

function checkIfGuessed(secretWord, letterPressed) {
    if (secretWord.includes(letterPressed)) {
        return true;
    } else {
        return false;
    }
}




createKeyBoard(keyBoardButtons);

