document.getElementById("generate-new").addEventListener("click", function () {
  document.getElementById("trivia-options").style.display = "block";
  document.getElementById("trivia-questions").style.display = "none";
  document.getElementById("generate").style.display = "block";
});

function generateTrivia() {
  var amount = 10;
  var category = document.getElementById("category").value;
  var difficulty = document.getElementById("difficulty").value;
  var type = document.getElementById("type").value;

  var apiUrl =
    "https://opentdb.com/api.php?amount=" +
    amount +
    "&category=" +
    category +
    "&difficulty=" +
    difficulty +
    "&type=" +
    type;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showTrivia(data.results);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function showTrivia(questions) {
  var triviaOptions = document.getElementById("trivia-options");
  var triviaQuestions = document.getElementById("trivia-questions");
  var questionContainer = document.getElementById("question-container");
  var choicesContainer = document.getElementById("choices-container");
  var submitBtn = document.getElementById("submit");
  var scoreContainer = document.getElementById("score");
  var generateBtn = document.getElementById("generate");
  var generateNewBtn = document.getElementById("generate-new");

  triviaOptions.style.display = "none";
  triviaQuestions.style.display = "block";

  var score = 0;
  var currentQuestionIndex = 0;

  function showNextQuestion() {
    if (currentQuestionIndex < 10) {
      var question = questions[currentQuestionIndex];
      var questionText = decodeURIComponent(question.question);
      var choices = question.incorrect_answers.map(function (answer) {
        return decodeURIComponent(answer);
      });
      choices.push(decodeURIComponent(question.correct_answer));
      choices.sort(function () {
        return 0.5 - Math.random();
      });

      questionContainer.textContent = questionText;
      choicesContainer.innerHTML = "";

      choices.forEach(function (choice) {
        var choiceElem = document.createElement("div");
        choiceElem.className = "choice";

        var radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "answer";
        radioBtn.value = choice;
        choiceElem.appendChild(radioBtn);

        var choiceLabel = document.createElement("label");
        choiceLabel.textContent = choice;
        choiceElem.appendChild(choiceLabel);

        choicesContainer.appendChild(choiceElem);
      });

      submitBtn.style.display = "block";
      submitBtn.addEventListener("click", function () {
        var selectedAnswer = document.querySelector(
          'input[name="answer"]:checked'
        );
        if (
          selectedAnswer &&
          selectedAnswer.value ===
            decodeURIComponent(question.correct_answer)
        ) {
          score += 100;
        }
        currentQuestionIndex++;
        showNextQuestion();
      });
    } else {
      questionContainer.textContent = "";
      choicesContainer.innerHTML = "";
      scoreContainer.textContent = "Puntaje final: " + score;
      scoreContainer.style.display = "block";
      submitBtn.style.display = "none";
      generateNewBtn.style.display = "block";
    }
  }

  submitBtn.style.display = "none";
  generateBtn.style.display = "none";
  generateNewBtn.style.display = "none";
  showNextQuestion();
}

document.getElementById("generate").addEventListener("click", generateTrivia);
