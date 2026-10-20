document.addEventListener("DOMContentLoaded", function () {
  var array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var originalArray = array.slice();
  var numberOfTurns = 0;
  var isReset = false;
  var gridSize; 
  var isGameStarted = false;
  initializeGameLevelButtons(); 
  disableStartButton(true);
  disableResetButton(true);
  disableGameLevelButtons(true);
  checkGameStarted();


   // Initial setup
   function disableStartButton(disable) {
    var startButton = document.getElementById("start");
    startButton.disabled = disable;
    startButton.classList.toggle("disabled-button", disable);
  }

  function disableResetButton(disable) {
    var resetButton = document.getElementById("reset");
    resetButton.disabled = disable;
    resetButton.classList.toggle("disabled-button", disable);
  }


  // Rebuild array and originalArray for the chosen grid size
  //size can be = 3*3 ... 
  function updateArrayForGridSize(size) {
    // Update the global gridSize
    gridSize = size;
    // Reset the global array; it stores the current order of the puzzle pieces
    array = [];
    // Fill it with 0 to size*size-1
    for (let i = 0; i < size * size; i++) {
      array.push(i);
    }
    originalArray = array.slice();
  }

  // gridSizeValue is the board size the game starts with
  function Start(gridSizeValue, shuffle = false) {
    // Set the puzzle size and the starting order of the array
    updateArrayForGridSize(gridSizeValue);
    isReset = false;
    // Only shuffle when asked to
    if (shuffle) {
      ShuffleArray(array); 
    }
    GetPuzzlePieces();
    isGameStarted = true;
    disableGameLevelButtons(false);
    checkGameStarted(); // check again now that the game has started
  }

  function UpdateNumberOfTurns(value) {
    numberOfTurns = value;
    document.getElementById("turns").innerHTML = numberOfTurns;
  }

  function Reset() {
    isReset = true;
    UpdateNumberOfTurns(0);
    ResetPuzzle();
    GetPuzzlePieces();
    isGameStarted = false;
    checkGameStarted(); // check again after the reset
    disableStartButton(true); 
    disableResetButton(true); 
  }

  let startButton = document.getElementById("start");
  let resetButton = document.getElementById("reset");

   // Enable or disable buttons depending on whether the game has started
   function checkGameStarted() {
    if (isGameStarted) {
      document.getElementById("start").disabled = true;
      disableGameLevelButtons(true);
    } else {
      document.getElementById("start").disabled = false;
      disableGameLevelButtons(false);
    }
  }

  // Start button
  document.getElementById("start").addEventListener("click", function () {
    if (selectedGameLevel) {
        Start(selectedGameLevel, true); 
        disableResetButton(false);
    }
  });



   // Reset button
   document.getElementById("reset").addEventListener("click", function () {
    Reset();
  });

  
  //disable game level buttons function
  function disableGameLevelButtons(disable) {
    document.getElementById('easy').disabled = disable;
    document.getElementById('medium').disabled = disable;
    document.getElementById('hard').disabled = disable;
  }

  // Global variable that stores the chosen game level
  var selectedGameLevel = null;

  function initializeGameLevelButtons() {
    var easyButton = document.getElementById('easy');
    var mediumButton = document.getElementById('medium');
    var hardButton = document.getElementById('hard');
    
    easyButton.addEventListener('click', function() {
        selectedGameLevel = 3;
        disableOtherGameLevelButtons(easyButton);
        disableStartButton(false); // enable the Start button
    });
    mediumButton.addEventListener('click', function() {
        selectedGameLevel = 4;
        disableOtherGameLevelButtons(mediumButton);
        disableStartButton(false); 
    });
    hardButton.addEventListener('click', function() {
        selectedGameLevel = 5;
        disableOtherGameLevelButtons(hardButton);
        disableStartButton(false); 
    });
  }

// Disable every level button except the one that was picked
function disableOtherGameLevelButtons(selectedButton) {
    var buttons = [document.getElementById('easy'), document.getElementById('medium'), document.getElementById('hard')];
    buttons.forEach(button => {
        if (button !== selectedButton) {
            button.disabled = true; // disable the buttons that weren't picked
        }
    });
}


  //upload picture
  var fileInput = document.createElement("input");
  // Make it a file input so the user can upload a picture
  fileInput.type = "file";
  // Only accept image files (image/* means any image type)
  fileInput.accept = "image/*";
  fileInput.style.width = "180px";
  fileInput.style.margin = "20px";
  var controlsContainer = document.querySelector(".leftContainer");
  controlsContainer.appendChild(fileInput);

  fileInput.addEventListener("change", function (e) {
    console.log("File input changed.");
    // e.target.files: make sure the files list exists
    // e.target.files[0]: make sure at least one file was chosen
    if (e.target.files && e.target.files[0]) {
      // FileReader reads the uploaded file
      var reader = new FileReader();
      reader.onload = function (e) {
        // Use the uploaded picture as the puzzle image
        var puzzleImage = document.getElementById("fixedImg"); // Moved inside to ensure accessibility
        puzzleImage.src = e.target.result;
      };
      puzzleImage.onload = GetPuzzlePieces;
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Get the puzzleImage element
  var puzzleImage = document.getElementById("fixedImg");

  function GetPuzzlePieces() {
    var puzzleContainer = document.getElementById("puzzleContainer");

    // Get the image source
    var imageUrl = puzzleImage.src;

    // Clear the puzzle container so shuffled pieces don't stack on top of each other
    puzzleContainer.innerHTML = "";

    // Dynamically set the grid layout to match gridSize
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Calculate the width and height of each puzzle piece
    // Divide by gridSize because the board is gridSize x gridSize (3 for a 3x3 puzzle)
    var pieceWidth = puzzleImage.width / gridSize;
    var pieceHeight = puzzleImage.height / gridSize;

    //size of the puzzleContainer
    puzzleContainer.style.width = puzzleImage.width + "px";
    puzzleContainer.style.height = puzzleImage.height + "px";

    // index = > current index of array
    // i = > position of the index
    array.forEach((index, i) => {
      var row = Math.floor(index / gridSize); // row and column of this piece in the picture
      var col = index % gridSize;
      var piece = document.createElement("div"); // one puzzle piece

      piece.style.width = pieceWidth + "px";
      piece.style.height = pieceHeight + "px";
      piece.style.backgroundImage = `url('${imageUrl}')`;
      piece.style.backgroundSize = `${puzzleImage.width}px ${puzzleImage.height}px`;
      piece.style.backgroundPosition = `${-(col * pieceWidth)}px ${-(
        row * pieceHeight
      )}px`; //0*120 , 1*120 ...
      piece.style.border = "1px solid #333";
      piece.style.boxSizing = "border-box";

      // Make the last piece (index 8 on 3x3) the white blank, but not while the game is reset
      if (index === array.length - 1) {
        // Set the background color to white for the blank piece
        piece.style.backgroundColor = "white";
        piece.style.zIndex = "-10000";
      }
      if (isReset) {
        piece.style.backgroundColor = "";
        piece.style.zIndex = "";
      }

      // Clicking a piece tries to move it
      piece.addEventListener("click", function () {
        // i = the position of this piece on the board
        MovePiece(i);
      });

      // Append the puzzle piece to the container
      puzzleContainer.appendChild(piece);
    });
  }

  function ShuffleArray(array) {
    numberOfTurns = 0;
    document.getElementById("turns").innerHTML = numberOfTurns;

    // Create a copy of the array
    // Ensure that the original order of the elements in the array is preserved.
    const tempArray = originalArray.slice();

    do {
      // It starts from the last index (tempArray.length - 1) and goes down to 0.
      for (let i = tempArray.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]; // Swapping values of [i] and [j]
      }
    } while (!isSolvable(tempArray));

    // Update the original array with the shuffled values
    for (let i = 0; i < array.length; i++) {
      array[i] = tempArray[i];
    }
  }

  // Check whether a shuffled board can actually be solved
  // The blank is the piece with the highest value (array.length - 1), so leave it out when counting inversions
  function isSolvable(array) {
    const gridWidth = Math.sqrt(array.length);
    const blank = array.length - 1;
    const tiles = array.filter((value) => value !== blank);

    let inversions = 0;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }

    // Odd width (3x3, 5x5): the inversion count must be even
    if (gridWidth % 2 === 1) {
      return inversions % 2 === 0;
    }

    // Even width (4x4): inversions + blank's row counted from the bottom must be odd
    const blankRowFromBottom = gridWidth - Math.floor(array.indexOf(blank) / gridWidth);
    return (inversions + blankRowFromBottom) % 2 === 1;
  }

  // Reset puzzle function
  function ResetPuzzle() {
    //to store the initial state of the puzzle pieces, if  way around
    //If you assign originalArray to array, any changes made to array would also affect originalArray
    array = originalArray.slice();
    GetPuzzlePieces();
  }

  var gridSize = 3; // its a 3*3 puzzle
  // First check whether the clicked piece can move
  function IsMove(clickIndex, blankIndex) {
    // Row and column of the clicked piece
    var clickRow = Math.floor(clickIndex / gridSize); // result = 1
    var clickCol = clickIndex % gridSize; // result = 2

    // Row and column of the blank
    var blankRow = Math.floor(blankIndex / gridSize); //result = 2
    var blankCol = blankIndex % gridSize; //result = 2

    // var dontMoveRow = Math.floor((gridSize * gridSize - 1) / gridSize);// result = 2, row index of the last piece
    // var dontMoveCol = (gridSize * gridSize - 1) % gridSize;

    if (clickRow == blankRow && Math.abs(clickCol - blankCol) == 1) {
      return true;
    } else if (clickCol == blankCol && Math.abs(clickRow - blankRow) == 1) {
      return true;
    }
  }

  function MovePiece(clickIndex) {
    var blankPuzzlePiece = array.indexOf(array.length - 1);

    // If the player clicks after a reset, show a reminder
    if (isReset) {
      alert("Please click on START button to start the game ~");
      // This stops the function if the game is reset
      // return stops the rest of this function from running
      // (it returns undefined)
      return;
    }
    if (IsMove(clickIndex, blankPuzzlePiece)) {
      //swap with blank piece
      [array[clickIndex], array[blankPuzzlePiece]] = [
        array[blankPuzzlePiece],
        array[clickIndex],
      ];

      numberOfTurns++;
      document.getElementById("turns").innerHTML = numberOfTurns;

      // Redraw the board
      GetPuzzlePieces();

      // Wait a moment before checking for a win so the move has time to render
      setTimeout(FinishPuzzle, 300);
    }
  }
  // Puzzle finished: show a message
  function FinishPuzzle() {
    if (array.join(",") === originalArray.join(",")) {
      alert("Puzzle solved!");
    }
  }

  function gameLevelBtn() {
    var easyButton = document.getElementById('easy');
    var mediumButton = document.getElementById('medium');
    var hardButton = document.getElementById('hard');

    easyButton.style.backgroundColor = '#4CAF50'; 
    mediumButton.style.backgroundColor = 'orange'; 
    hardButton.style.backgroundColor = 'red'; 
  }
  window.onload = gameLevelBtn;
});
