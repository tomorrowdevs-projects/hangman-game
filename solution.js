//tastiera a video realizzata sul layout
//per le parole da indovinare proviamo ad usare una api swapi
//quando ho finito la partita avro un button che resetta

const keyBoardSection = document.getElementById("keyboard");
const hangWordContainer = document.querySelector(".hang-word");
const hangBoard = document.querySelector("#hang-board");
const paragraphsLowDash = document.querySelectorAll("p");

/**
 * It creates a button for each letter in the keyBoard array, and then calls the keyPressed function.
 * @param keyBoard - an array of objects that contain the letter and the status of the letter.
 */
async function createKeyBoard(keyBoard) {
  const secretWords = await getSecretWords();
  keyBoard.forEach((key) => {
    const newButton = document.createElement("button");
    newButton.classList.add("btn");
    const buttonLetter = document.createTextNode(key.letter);
    newButton.appendChild(buttonLetter);
    keyBoardSection.appendChild(newButton);
  });

  keyPressed(secretWords);
}

/**
 * The function takes a random word from the array and checks if the letter pressed is in the word. If
 * it is, it will reveal the letter in the word. If it's not, it will add 1 to the attempts. If the
 * attempts reach 3, the game is over.
 * @param randomSecretWord - the word that the user has to guess
 */
function keyPressed(randomSecretWord) {
  const buttons = document.querySelectorAll(".btn");
  let letterPressed = "";
  const lettersGuessed = [];
  const maxAttempts = 3;
  let attempts = 0;
  document.addEventListener("keyup", (event) => {
    const keyPressed = String.fromCharCode(event.keyCode);
    const isGuessed = checkIfGuessed(randomSecretWord, keyPressed);
    if (isGuessed) {
      paragraphsLowDash.forEach((paragraph, i) => {
        if (
          keyPressed === randomSecretWord[i] &&
          paragraph.innerHTML !== keyPressed
        ) {
          paragraph.innerHTML = randomSecretWord[i];
          lettersGuessed.push(paragraph.innerHTML);
          if (lettersGuessed.length === randomSecretWord.length) {
            showAlert("won");
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
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("clicked-btn");
      button.attributes.disabled = true;
      /* It's a variable that is being used to store the letter that the user pressed. */
      letterPressed = button.textContent;

      const isGuessed = checkIfGuessed(randomSecretWord, letterPressed);
      if (isGuessed) {
        const paragraphsLowDash = document.querySelectorAll("p");
        paragraphsLowDash.forEach((paragraph, i) => {
          if (
            /* It's checking if the letter pressed is in the secret word and if it's not already
            displayed. */
            letterPressed === randomSecretWord[i] &&
            paragraph.innerHTML !== letterPressed
          ) {
            paragraph.innerHTML = randomSecretWord[i];
            lettersGuessed.push(paragraph.innerHTML);
            if (lettersGuessed.length === randomSecretWord.length) {
              showAlert("won");
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

/**
 * It fetches the data from the API, then maps over the results and pushes the planet names to an
 * array, then returns a randomly chosen word from that array.
 * @returns a promise.
 */
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
  const randomSecretWord = await randomlyChosenWord(secretWords);
  return randomSecretWord;
}

/**
 * It takes an array of words, chooses one at random, and then returns that word.
 * @param secrets - an array of words
 * @returns The word that is being returned is the word that is being randomly chosen from the array of
 * words.
 */
async function randomlyChosenWord(secrets) {
  const randomNumberIndex = Math.floor(Math.random() * secrets.length);
  console.log("random secret word: ", secrets[randomNumberIndex]);

  createHangBoard(secrets[randomNumberIndex]);
  return await secrets[randomNumberIndex];
}

/**
 * It takes a random word from the array, splits it into letters, and then creates a paragraph element
 * for each letter and appends it to the hangWordContainer div.
 * @param randomSecretWord - "apple"
 */
function createHangBoard(randomSecretWord) {
  const splittedWord = randomSecretWord.split("");
  splittedWord.forEach((letter) => {
    const newVoidLowDash = document.createElement("p");
    newVoidLowDash.classList.add("low-dash");
    const pLowDash = document.createTextNode("_");
    newVoidLowDash.appendChild(pLowDash);
    hangWordContainer.appendChild(newVoidLowDash);
  });
}

/**
 * If the secret word includes the letter pressed, return true, otherwise return false.
 * @param secretWord - the word that the user is trying to guess
 * @param letterPressed - the letter that the user pressed
 * @returns a boolean value.
 */
function checkIfGuessed(secretWord, letterPressed) {
  if (secretWord.includes(letterPressed)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Reset the game by removing the hangboard, getting new secret words, and creating a new keyboard.
 */
const reset = async function resetProgram() {
  hangBoard.innerHTML = "";
  hangBoard.appendChild(hangWordContainer);
  hangBoard.removeChild(hangWordContainer);
  hangWordContainer.innerHTML = "";
  hangBoard.appendChild(hangWordContainer);
  keyBoardSection.innerHTML = "";

  createKeyBoard(keyBoardButtons);
};

/**
 * The showAlert function takes a message as an argument and displays it in a div with a button that
 * resets the game.
 * @param message - the message to display in the alert
 */
function showAlert(message) {
  const alertMessage = `
            <div class="game-alert">
                <div class="game-alert-message">
                    You ${message}, <button id="reset-btn">play again!</button>
                </div>
            </div>
    `;

  hangBoard.innerHTML = hangBoard.innerHTML + alertMessage;

  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", reset);
}

createKeyBoard(keyBoardButtons);
