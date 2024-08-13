//Select Variables
let categorySpan = document.querySelector('.category span');
let countSpan = document.querySelector('.count span');
let Bullets = document.querySelector('.bullets');
let bulletsSpansContainer = document.querySelector('.bullets .spans-container');
let countdownContainer = document.querySelector('.bullets .countdown');
let quizQuestion = document.querySelector('.quiz-app .quiz-question');
let quizAnswers = document.querySelector('.quiz-app .quiz-answers');
let theButtons = document.querySelector('.buttons-controle');
let submitButton = document.querySelector('.submit-button');
let allButtons = document.querySelector('.language-buttons');
let arrayOfButtons = Array.from(allButtons.children);
let htmlButton = document.querySelector('.language-buttons .html');
let cssButton = document.querySelector('.language-buttons .css');
let resultsContainer = document.querySelector('.result');

//Set Options
currentIndex =0;
let rightAnswers = 0;
let countdownInterval;
let urlHTML = 'the_html_questions.json';
let urlCSS = 'the_css_questions.json';

function getQuestions(url) {

  let myRequest = new XMLHttpRequest;

  myRequest.onreadystatechange = function() {

    if(this.readyState === 4 && this.status === 200) {

      let questionsObject = JSON.parse(this.responseText);

      let questionsCount = questionsObject.length;

      //Function Create Bullets
      createBullets(questionsCount);

      //Function Add Questions Data
      addQuestionsData(questionsObject[currentIndex],questionsCount);

      //Function Countdown
      countdown(90, questionsCount);

      //Click On Submit
      submitButton.onclick = function() {

        let theRightAnswer = questionsObject[currentIndex].right_answer;

        currentIndex++;

        //Check Answer
        checkAnswer(theRightAnswer,questionsCount);

        //Remove Previous Question
        quizQuestion.innerHTML = '';
        quizAnswers.innerHTML = '';

        //Function Add Questions Data
        addQuestionsData(questionsObject[currentIndex],questionsCount);

        //Handle Bullets
        handleBullets();

        //Function Countdown
        clearInterval(countdownInterval);  //Stop The Previous Countdown
        countdown(90, questionsCount);

        //Show Results
        showResults(questionsCount);

      }

    }
  };

  myRequest.open('GET', url ,true);

  myRequest.send();

};

//Function HTML Language
htmlButton.addEventListener('click', function() {

  categorySpan.innerHTML = 'HTML';
  quizQuestion.innerHTML = '';
  quizAnswers.innerHTML = '';
  bulletsSpansContainer.innerHTML = '';

  arrayOfButtons.forEach((button) => {

    button.classList.add('no-clicked');
  })

  getQuestions(urlHTML);
})
//Function CSS Language
cssButton.addEventListener('click', function() {

  categorySpan.innerHTML = 'CSS';
  quizQuestion.innerHTML = '';
  quizAnswers.innerHTML = '';
  bulletsSpansContainer.innerHTML = '';

  arrayOfButtons.forEach((button) => {

    button.classList.add('no-clicked');
  })

  getQuestions(urlCSS);
})


//Function Create Bullets
function createBullets(num) {

  countSpan.innerHTML = num;

  //Create Bullets
  for(i = 1; i <= num; i++) {

    //Create The Bullet
    theBullet = document.createElement('span');

    //Chec If Its The First Span
    if(i == 1) {

      theBullet.classList.add('on');

    }

    //Append Bullet To The Main Bullets Container
    bulletsSpansContainer.appendChild(theBullet);
  }
}

//Function Add Questions Data
function addQuestionsData(obj,count) {

  if(currentIndex < count) {

    //Create h2 Question Title 
    let questionTitle = document.createElement('h2');

    //Create Text The Title
    let questionText = document.createTextNode(obj.title);

    //Append Text To The Title
    questionTitle.appendChild(questionText);

    //Append h2 To The Div
    quizQuestion.appendChild(questionTitle);

    //Create The Answers
    for(i = 1; i <= 4; i++) {

      //Create The Main Answer Div 
      let mainDiv = document.createElement('div');

      //Add Class To The Div
      mainDiv.className = 'answer';

      //Create Radio Input
      let radioInput = document.createElement('input');

      //Add Type + Name + Data-Attribute
      radioInput.type = 'radio';
      radioInput.name = 'question';

      /*Make First Option Selected
        if(i == 1) {

            radioInput.checked = true;
        }*/

      //Create Label
      let theLabel = document.createElement('label');

      //Create Label Text
      //let labelText = document.createTextNode(obj[`answer_${i}`]);

      //Append Text To The Label
      //theLabel.appendChild(labelText);

      //Append Radio Input + Label To the Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      //Append All Divs To The Answer Container
      quizAnswers.appendChild(mainDiv);

    }

    //Handle Shuffle Function
    let arrayOfAnswers = Array.from(quizAnswers.children);
    let orderRange = Array.from(Array(arrayOfAnswers.length).keys());  //[0,1,2,3]

    shuffle(orderRange);  //[3,0,2,1]

    //Add Order Css Property To Answer Div
    arrayOfAnswers.forEach((answer,index) => {

      answer.style.order = orderRange[index];
    });

    let allInputs = document.querySelectorAll('.quiz-answers input');
    allInputs.forEach((input,index) => {

      input.id = `answer_${orderRange[index]}`;

      input.dataset.answer = obj[`answer_${orderRange[index]}`];
    })

    let allLabel = document.querySelectorAll('.quiz-answers label');
    allLabel.forEach((label,index) => {

      label.htmlFor = `answer_${orderRange[index]}`;

      label.innerHTML = obj[`answer_${orderRange[index]}`];
    })

  }

}

//Function Check Answer
function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName('question'); //document.querySelectorAll('input')

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {

    if (answers[i].checked) {

      theChoosenAnswer = answers[i].dataset.answer;

    }

  }

  if (rAnswer === theChoosenAnswer) {

    rightAnswers++;

  }
}

//Function Handle Bullets
function handleBullets() {

  let bulletsSpans = document.querySelectorAll('.spans-container span');
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span,index) => {

    if(currentIndex === index) {

      span.classList.add('on');
    }
  });
}

//Function Show Results
function showResults(count) {

  if(currentIndex === count) {

    quizQuestion.remove(),quizAnswers.remove(),theButtons.remove(),Bullets.remove();

    //Create Button Result
    let btnResult = document.createElement('button');

    let textButton = document.createTextNode('View Score');

    btnResult.className = 'btn-result';

    btnResult.appendChild(textButton);

    resultsContainer.appendChild(btnResult);

    btnResult.addEventListener('click', function() {

      let theResults;
      
      theResults = `<span></span> Your Result IS ${rightAnswers} From ${count}`;

      resultsContainer.innerHTML = theResults;

      resultSpan = document.querySelector('.result span');


      if(rightAnswers === count) {

        resultSpan.className = 'perfect';

        resultSpan.innerHTML = 'Perfect';

      } else if (rightAnswers > count/2 && rightAnswers < count) {

        resultSpan.className = 'good';

        resultSpan.innerHTML = 'Good';

      } else {

        resultSpan.className = 'bad';

        resultSpan.innerHTML = 'Bad';

      }
    })

  }
}

//Function Countdown
function countdown(duration,count) {

  countdownInterval = setInterval(function() {

    let minutes,seconds;
    if(currentIndex < count) {

      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownContainer.innerHTML = `${minutes}:${seconds}`;

      if(--duration < 0) {

        clearInterval(countdownInterval);
        submitButton.click();
      }
      /*if(seconds == 00) {

                countdownContainer.style.color = '#f00';
            }*/
    }
  },1000);
}

//Function Shuffle 
function shuffle(array) {

  let current = array.length,
      tempo,
      random;

  while(current > 0) {

    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;

  }

  return(array);
}


