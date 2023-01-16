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
const hangBoard = document.querySelector("#hang-board");

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
   const lettersGuessed = [];
  const maxAttempts = 3;
  let attempts = 0;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      letterPressed = button.textContent;
      lettersPressed.push(letterPressed);
      button.disabled = true;
      console.log("rnd", randomSecretWord);
      const isGuessed = checkIfGuessed(randomSecretWord, letterPressed);
      if (isGuessed) {
        const paragraphsLowDash = document.querySelectorAll("p");
       
        
        let revealWord = "";
        paragraphsLowDash.forEach((paragraph, i) => {
          console.log(randomSecretWord.length);
          if (
            letterPressed === randomSecretWord[i] &&
            paragraph.innerHTML !== letterPressed
          ) {
            paragraph.innerHTML = randomSecretWord[i]; 
            lettersGuessed.push(paragraph.innerHTML);
            console.log(lettersGuessed);
            if (lettersGuessed.length === randomSecretWord.length) {
              console.log(lettersGuessed);
              showAlert('won');
            }
          }
          
          

        });
      } else {
        attempts = attempts + 1;
        if (attempts === maxAttempts) {
          showAlert("lost");
        }
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
  console.log("splitted", splittedWord);
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

function showAlert(message) {
  const alertMessage = `
            <div class="game-alert">
                <div class="game-alert-message">
                    You ${message === "lost" ? "lost" : "won"}, play again!
                </div>
            </div>
    `;

  hangBoard.innerHTML = hangBoard.innerHTML + alertMessage;
}

/*
function checkIfWon(wordsArray) {
  const isEveryWordGuessed = (currentLetter) => currentLetter.innerHTML !== '_';
  wordsArray.every(isEveryWordGuessed);
}
*/

createKeyBoard(keyBoardButtons);
