// -- COUNTER COMPONENT --
const textareaEl = document.querySelector('.form__textarea')
const counterEl = document.querySelector('.counter')


const inputHandler = () => {
  //determine maximum numbers of characters
  const maximumNumber = 150;
  //determine number of characters currently typed
  const numberOfCharacter = textareaEl.value.length;
  //calculate number of character left (maximum - currently type )
  const characterLeft = maximumNumber - numberOfCharacter
  //show number of characters left 
  counterEl.textContent = characterLeft
};

textareaEl.addEventListener('input', inputHandler);


// -- FORM COMPONENT --
const formEl = document.querySelector('.form');

const submitHandler = (event) => {
  event.preventDefault();
}

formEl.addEventListener('submit', submitHandler)
