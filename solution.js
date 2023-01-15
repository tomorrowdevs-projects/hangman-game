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

function createKeyBoard(keyBoard) {
  keyBoard.forEach((element) => {
    const newButton = document.createElement("button");
    newButton.classList.add("btn");
    const buttonLetter = document.createTextNode(element.letter);
    newButton.appendChild(buttonLetter);
    keyBoardSection.appendChild(newButton);  
  });
    keyPressed();
}

function keyPressed() {
    const buttons = document.querySelectorAll('.btn');
    let letterPressed = '';
    const lettersPressed = [];
    buttons.forEach((button) => {
        button.addEventListener('click', ()=> {
            letterPressed = button.textContent;
            lettersPressed.push(letterPressed);
            button.disabled = true;
        })
    });
}

async function getSecretWords() {
    const secretWords = [];
    await fetch('https://swapi.dev/api/planets')
        .then((response) => response.json())
        .then((data) => {
            data.results.map((planet) => {
                secretWords.push(planet.name.toUpperCase());
            })
        });
    console.log("secret words array: ", secretWords);
    randomlyChosenWord(secretWords);
}

async function randomlyChosenWord(secrets) {
    const randomNumberIndex = await Math.floor(Math.random() * secrets.length);
    console.log("random secret word: ", secrets[randomNumberIndex]);
    return secrets[randomNumberIndex];
}
 




createKeyBoard(keyBoardButtons);
getSecretWords();

