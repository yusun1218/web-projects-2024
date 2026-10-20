document.addEventListener("DOMContentLoaded", function () {
  var overlay = document.querySelector(".overlay");
  var startButton = document.getElementById("start");
  var restartButton = document.getElementById("restart");
  var emptyListButton = document.getElementById("emptyList");
  var inputElement = document.getElementById("inputVal");
  var sendButton = document.getElementById("sendBtn");
  var peek = document.getElementById("peekContainer");
  var randomNumberShow = document.getElementById("randomNumber");
  var tbody = document.querySelector(".contentTable tbody");
  var messageContainer = document.querySelector(".messageContainer");
  var messageText = document.querySelector(".messageText");
  var gameRuleButton = document.querySelector(".gameRuleButton");

  // Game State Variables
  var generatedNum = "";
  var guessCount = 0;
  var enteredNumbers = [];

  // Initializes the game to its default state
  function initializeGame() {
    [sendButton, emptyListButton, restartButton].forEach((button) => {
      button.disabled = true;
      button.style.cursor = "not-allowed";
    });
    startButton.disabled = false; // Only the start button is enabled
  }
  initializeGame(); // Call to initialize game on page load

  // Generates a 4-digit random number as a string
  function GenerateNumbers() {
    var numbers = Array.from({ length: 10 }, (_, i) => i.toString());
    var generatedNumArray = [];
    for (var i = 0; i < 4; i++) {
      var index = Math.floor(Math.random() * numbers.length);
      var randomNum = numbers.splice(index, 1)[0];
      generatedNumArray.push(randomNum);
    }
    return generatedNumArray.join("");
  }

  // Toggles the peek feature to show/hide the generated number
  function Peeking() {
    var isFlipped = peek.classList.contains("flipped");
    peek.classList.toggle("flipped");
    if (!isFlipped) {
      randomNumberShow.textContent = generatedNum;
    } else {
      setTimeout(function () {
        peek.classList.remove("flipped");
        randomNumberShow.textContent = "";
      }, 1000);
    }
  }

  // Starts or restarts the game
  function Start() {
    generatedNum = GenerateNumbers();
    // UI feedback for start button press
    startButton.disabled = true;
    [restartButton, emptyListButton, sendButton].forEach((button) => {
      button.disabled = false;
      button.style.cursor = "pointer";
    });
    inputElement.disabled = false;
  }

  function Restart() {
    // Similar to Start but also resets game state
    Start();
    guessCount = 0;
    enteredNumbers = [];
    tbody.innerHTML = "";
    inputElement.value = "";
  }

  function EmptyList() {
    inputElement.value = "";
  }

  function Send() {
    var inputVal = inputElement.value;
    if (!Validation(inputVal)) return; // Ensure the input is valid
    var { a, b } = CompareAnswer(inputVal);
    guessCount++;
    ShowAnswer(inputVal, a, b); // Displays the guess and results
    if (a === 4) {
      ShowMessage(
        'Congrats on winning the game !! <img src="images/icons8-smiling-face-with-heart-50.png">',
        "success", 
        true
      );
      DisabledBtn(); // Disable buttons after win
    }
  }

  function CompareAnswer(inputVal) {
    var a = 0,
      b = 0;
    for (let i = 0; i < 4; i++) {
      if (generatedNum[i] === inputVal[i]) {
        a++;
      } else if (generatedNum.includes(inputVal[i])) {
        b++;
      }
    }
    return { a, b };
  }

  // Disables buttons post-game
  function DisabledBtn() {
    [inputElement, restartButton, sendButton, emptyListButton].forEach(
      (button) => {
        button.disabled = true;
        button.style.cursor = "not-allowed";
      }
    );
  }

  // Display guess results in the table
  function ShowAnswer(inputVal, a, b) {
    var row = tbody.insertRow();
    var guessCell = row.insertCell(0);
    var resultCell = row.insertCell(1);
    var countCell = row.insertCell(2);
    guessCell.textContent = inputVal;
    resultCell.textContent = `${a}A${b}B`;
    countCell.textContent = guessCount;
  }

  // Shows messages for various game states
  function ShowMessage(message, messageType, isWinningMessage = false) {
    // Clear previous message text and buttons
    messageText.innerHTML = "";

    // Create a confirm button
    var confirmButton = document.createElement("button");
    confirmButton.textContent = "OK";
    // Set button styles as needed
    confirmButton.style.padding = "5px 10px";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.position = "absolute"; 
    confirmButton.style.bottom = "10px"; 
    confirmButton.style.right = "10px"; 

    // Add click event listener to the confirm button
    confirmButton.addEventListener("click", function () {
        messageContainer.style.display = "none";
        overlay.style.display = "none";
        if (isWinningMessage){
          window.location.reload();
        }
    });

    // Set message text
    messageText.innerHTML = message;
    // Add the confirm button to the message container
    messageText.appendChild(confirmButton);

    // Set styles based on message type
    messageContainer.classList.remove("error", "success");
    if (messageType === "error") {
        messageContainer.classList.add("error");
        messageContainer.style.backgroundColor = "red";
    } else if (messageType === "success") {
        messageContainer.classList.add("success");
        messageContainer.style.backgroundColor = "green";
    } else {
        // Assume "normal" for informational messages like game rules
        messageContainer.style.backgroundColor = "blue"; // Example color
        messageContainer.style.color = "white"; // Ensure text is readable
    }
    // Display the message container and overlay
    messageContainer.style.display = "block";
    overlay.style.display = "block";
}

  //game rules
  function ShowGameRules() {
    var rulesMessage = "How to Play <br>" +
        "1.&emsp;Enter 4 digits. No letters, and no digit can repeat. <br>" +
        "2.&emsp;A = right digit in the right place <br>" +
        "3.&emsp;B = right digit in the wrong place <br>" +
        "4.&emsp;Get 4A to win!";

    ShowMessage(rulesMessage, "normal"); 
}


  // Validation of input
  function Validation(inputVal) {
    var num = Number(inputVal);
    if (isNaN(num) || inputVal.length !== 4) {
      ShowMessage(
        'Please Enter a 4-digit Number! <img src="images/icons8-angry-50.png">',
        "error"
      );
      return false;
    }
    if (enteredNumbers.includes(inputVal)) {
      ShowMessage(
        'Please Enter a Different Number! <img src="images/icons8-angry-50.png">',
        "error"
      );
      return false;
    }
    var numStr = inputVal;
    var digitSet = new Set(numStr);
    if (digitSet.size !== 4) {
      ShowMessage(
        'Number cannot have repeated digits! <img src="images/icons8-angry-50.png">',
        "error"
      );
      return false;
    }
    enteredNumbers.push(inputVal);
    return true;
  }

  // Event listeners for UI interactions
  gameRuleButton.addEventListener("click", ShowGameRules);
  startButton.addEventListener("click", Start);
  restartButton.addEventListener("click", Restart);
  sendButton.addEventListener("click", Send);
  emptyListButton.addEventListener("click", EmptyList);
  peek.addEventListener("click", Peeking);
  overlay.addEventListener("click", function () {
    messageContainer.style.display = "none";
    overlay.style.display = "none";
  });

  inputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      Send();
    }
  });

  document.addEventListener("keydown", function (event) {
    // Check if the pressed key is the Spacebar
    if (event.key === " " || event.code === "Space") {
      // Reload the page
      window.location.reload();
    }
  });
});
