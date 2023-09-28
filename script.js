// -- GLOBAL --
const MAX_CHARS = 150;
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");

const renderFeedbackItem = feedbackItem => {
  //new feedback item HTML
  const feedbackItemHTML = `
    <li class="feedback">
      <button class="upvote">
          <i class="fa-solid fa-caret-up upvote__icon"></i>
          <span class="upvote__count">${feedbackItem.upvoteCount}</span>
      </button>
      <section class="feedback__badge">
          <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
      </section>
      <div class="feedback__content">
          <p class="feedback__company">${feedbackItem.company}</p>
          <p class="feedback__text">${feedbackItem.text}</p>
      </div>
      <p class="feedback__date">${feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`}</p>
  </li>
`;

  //insert new feedback items into list
  feedbackEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
};

// -- COUNTER COMPONENT --
const inputHandler = () => {
  //determine maximum numbers of characters
  const maxNrChars = MAX_CHARS;
  //determine number of characters currently typed
  const numberOfCharacter = textareaEl.value.length;
  //calculate number of character left (maximum - currently type )
  const characterLeft = maxNrChars - numberOfCharacter;
  //show number of characters left
  counterEl.textContent = characterLeft;
};

textareaEl.addEventListener("input", inputHandler);

// -- FORM COMPONENT --
const showVisualIndicator = (textCheck) => {
  const className = textCheck === "valid" ? "form--valid" : "form--invalid";
  //show valid indicator
  formEl.classList.add(className);

  //remove visual indicator
  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
};

const submitHandler = (event) => {
  event.preventDefault();
  // get text from textarea
  const text = textareaEl.value;

  //validate text(# and text is long)
  if (text.includes("#") && text.length >= 5) {
    showVisualIndicator("valid");
  } else {
    showVisualIndicator("invalid");

    //focus textarea
    textareaEl.focus();
    //stop this function execution
    return;
  }

  //we have text, now extract other info from text
  const hashtag = text.split(" ").find((word) => word.includes("#"));
  const companyName = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  //create feedback items content
  const feedbackItem = {
    upvoteCount: upvoteCount,
    company: companyName,
    badgeLetter: badgeLetter,
    daysAgo: daysAgo,
    text: text
  };

  //render feedback item
  renderFeedbackItem(feedbackItem);

  //clear textarea
  textareaEl.value = "";

  //blur submit button
  submitBtnEl.blur();

  //reset counter
  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);



// -- FEEDBACK LIST COMPONENT --
fetch("https://bytegrad.com/course-assets/js/1/api/feedbacks")
  .then((response) => response.json())
  .then((data) => {
    //remove spinner
    spinnerEl.remove();

    //iterate over each element in feedbacks array and render it in list
    data.feedbacks.forEach((feedbackItem) => renderFeedbackItem(feedbackItem));
  })

  .catch((error) => {
    feedbackEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
  });
