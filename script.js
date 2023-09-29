// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = "https://bytegrad.com/course-assets/js/1/api";

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");
const hashtagListEl = document.querySelector(".hashtags");

const renderFeedbackItem = (feedbackItem) => {
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
      <p class="feedback__date">${
        feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
      }</p>
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
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  //render feedback and list
  const feedbackItem = {
    upvoteCount: upvoteCount,
    company: company,
    badgeLetter: badgeLetter,
    daysAgo: daysAgo,
    text: text,
  };
  renderFeedbackItem(feedbackItem);

  //send to server
  fetch(`${BASE_API_URL}/feedbacks`, {
    method: "POST",
    body: JSON.stringify(feedbackItem),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Something went wrong");
        return;
      }

      console.log("Successfully submitted");
    })
    .catch((error) => console.log(error));

  //clear textarea
  textareaEl.value = "";

  //blur submit button
  submitBtnEl.blur();

  //reset counter
  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

// -- FEEDBACK LIST COMPONENT --
const clickHandler = (event) => {
  // get clicked HTML-element
  const clickedEL = event.target;
  // determine
  const upvoteIntention = clickedEL.className.includes("upvote");
  //run option
  if (upvoteIntention) {
    //get button
    const upvoteBtnEl = clickedEL.closest('.upvote')
    //disable upvote button
    upvoteBtnEl.disabled = true;
    //get element
    const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count')
    // get count convert a number (+)
    let upvoteCount = +upvoteCountEl.textContent;
    // set count increment by 1
    upvoteCountEl.textContent = ++upvoteCount;

  } else {
    //expand the clicked item
    clickedEL.closest(".feedback").classList.toggle("feedback--expand");
  }
};

feedbackEl.addEventListener("click", clickHandler);



fetch(`${BASE_API_URL}/feedbacks`)
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

  //-- HASHTAG LIS ELEMENT
  const clickHandler2 = event =>{
    // the clicked element
    const clickedEL = event.target;

    //stop function if click happened in list, but outside buttons
    if(clickedEL.className === 'hashtags') return;

    //extract the name
    const companyNameFromHashtag = clickedEL.textContent.substring(1).toLowerCase().trim();

    //iterate over each feedback items
    feedbackEl.childNodes.forEach(childNode => {
      // stop this iteration if its a  text node
      if (childNode.nodeType === 3) return;

      //extract company name
      const companyNameFromFeedbackItems =  childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

      //remove feedback item from list if company names are not equal
      if(companyNameFromHashtag !== companyNameFromFeedbackItems){
        childNode.remove();
      }
    });
  };

  hashtagListEl.addEventListener('click', clickHandler2);