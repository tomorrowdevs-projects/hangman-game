//console.log(keyBoardButtons);
//tastiera a video realizzata sul layout
//per le parole da indovinare proviamo ad usare una api swapi
//quando ho finito la partita avro un button che resetta

const keyBoardSection = document.getElementById("keyboard");
const hangWordContainer = document.querySelector(".hang-word");
const hangBoard = document.querySelector("#hang-board");
const main = document.querySelector('main');

async function createKeyBoard(keyBoard) {
  keyBoard.forEach((key) => {
    const newButton = document.createElement("button");
    newButton.classList.add("btn");
    const buttonLetter = document.createTextNode(key.letter);
    newButton.appendChild(buttonLetter);
    keyBoardSection.appendChild(newButton);
  });
  const secretWords = await getSecretWords();
  keyPressed(secretWords);

}

function keyPressed(randomSecretWord) {
  const buttons = document.querySelectorAll(".btn");
  let letterPressed = "";
  const lettersPressed = [];
   const lettersGuessed = [];
  const maxAttempts = 3;
  let attempts = 0;
  document.addEventListener("keyup", (event) => {
    const keyPressed = String.fromCharCode(event.keyCode);
    const isGuessed = checkIfGuessed(randomSecretWord, keyPressed);
    if (isGuessed) {
      const paragraphsLowDash = document.querySelectorAll("p");

      paragraphsLowDash.forEach((paragraph, i) => {
        console.log(randomSecretWord.length);
        if (
          keyPressed === randomSecretWord[i] &&
          paragraph.innerHTML !== keyPressed
        ) {
          paragraph.innerHTML = randomSecretWord[i];
          lettersGuessed.push(paragraph.innerHTML);
          console.log(lettersGuessed);
          if (lettersGuessed.length === randomSecretWord.length) {
            console.log(lettersGuessed);
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


function btnKeyPressed() {
  
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
  const randomSecretWord = await randomlyChosenWord(secretWords);
  return randomSecretWord;
}

async function randomlyChosenWord(secrets) {
  const randomNumberIndex = Math.floor(Math.random() * secrets.length);
  console.log("random secret word: ", secrets[randomNumberIndex]);
  
  createHangBoard(secrets[randomNumberIndex]);
  return await secrets[randomNumberIndex];
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

const reset = async function resetProgram() {
  /*
  const keyBoardSection = document.getElementById("keyboard");
  const hangWordContainer = document.querySelector(".hang-word");
  const hangBoard = document.querySelector("#hang-board");
  const main = document.querySelector('main');
  */
  //window.location.reload();
  hangBoard.innerHTML = '';
  hangBoard.appendChild(hangWordContainer, hangWordContainer.innerHTML = '');
  await getSecretWords();
  hangBoard.removeChild(hangWordContainer);
  hangBoard.appendChild(hangWordContainer, hangWordContainer.innerHTML = '');

  keyBoardSection.innerHTML = '';

  createKeyBoard(keyBoardButtons);
  
}

function showAlert(message) {
  const alertMessage = `
            <div class="game-alert">
                <div class="game-alert-message">
                    You ${message}, <button id="reset-btn">play again!</button>
                </div>
            </div>
    `;

  hangBoard.innerHTML = hangBoard.innerHTML + alertMessage;

  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', reset);
    
    //body.innerHTML = '';
    //body.appendChild(await Promise.all([createKeyBoard(keyBoardButtons)]));
    
    
 
}



/*
function checkIfWon(wordsArray) {
  const isEveryWordGuessed = (currentLetter) => currentLetter.innerHTML !== '_';
  wordsArray.every(isEveryWordGuessed);
}
*/

createKeyBoard(keyBoardButtons);
