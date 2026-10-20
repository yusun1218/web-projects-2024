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


   // 初始設置
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


  //指定大小更新array和originalArray
  //size can be = 3*3 ... 
  function updateArrayForGridSize(size) {
    //將上面定義的 global variable gridSize更新為size
    gridSize = size;
    //將 global variable array重新定義為空術組, 儲存目前的拼圖塊的順序
    array = [];
    //從0到size*size-1的數
    for (let i = 0; i < size * size; i++) {
      array.push(i);
    }
    originalArray = array.slice();
  }

  //接收一個參數gridSizeValue，遊戲開始時的大小。
  function Start(gridSizeValue, shuffle = false) {
    //updateArrayForGridSize函數，並傳入gridSizeValue作為參數，更新拼圖大小 和array的初始排序。
    updateArrayForGridSize(gridSizeValue);
    isReset = false;
    // 只有在需要洗牌時才 call ShuffleArray function
    if (shuffle) {
      ShuffleArray(array); 
    }
    GetPuzzlePieces();
    isGameStarted = true;
    disableGameLevelButtons(false);
    checkGameStarted(); // 遊戲開始後再次檢查
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
    checkGameStarted(); // 重置後再次檢查
    disableStartButton(true); 
    disableResetButton(true); 
  }

  let startButton = document.getElementById("start");
  let resetButton = document.getElementById("reset");

   // 檢查是否遊戲已開始，並啟用/禁用按鈕
   function checkGameStarted() {
    if (isGameStarted) {
      document.getElementById("start").disabled = true;
      disableGameLevelButtons(true);
    } else {
      document.getElementById("start").disabled = false;
      disableGameLevelButtons(false);
    }
  }

  // 開始按鈕事件監聽器
  document.getElementById("start").addEventListener("click", function () {
    if (selectedGameLevel) {
        Start(selectedGameLevel, true); 
        disableResetButton(false);
    }
  });



   // 重置按鈕事件監聽器
   document.getElementById("reset").addEventListener("click", function () {
    Reset();
  });

  
  //disable game level buttons function
  function disableGameLevelButtons(disable) {
    document.getElementById('easy').disabled = disable;
    document.getElementById('medium').disabled = disable;
    document.getElementById('hard').disabled = disable;
  }

  //用 global variable 來儲存 game level變量
  var selectedGameLevel = null;

  function initializeGameLevelButtons() {
    var easyButton = document.getElementById('easy');
    var mediumButton = document.getElementById('medium');
    var hardButton = document.getElementById('hard');
    
    easyButton.addEventListener('click', function() {
        selectedGameLevel = 3;
        disableOtherGameLevelButtons(easyButton);
        disableStartButton(false); // 启用开始按钮
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

// 禁用除了当前选中的游戏难度按钮外的其他所有游戏难度按钮
function disableOtherGameLevelButtons(selectedButton) {
    var buttons = [document.getElementById('easy'), document.getElementById('medium'), document.getElementById('hard')];
    buttons.forEach(button => {
        if (button !== selectedButton) {
            button.disabled = true; // 禁用非选中的按钮
        }
    });
}


  //upload picture
  var fileInput = document.createElement("input");
  //設置 <input> 元素的類型為 'file'，允許用戶選擇文件上傳。
  fileInput.type = "file";
  //這行代碼限制 <input> 元素只接受圖片文件，image/* 表示所有類型的圖片。
  fileInput.accept = "image/*";
  fileInput.style.width = "180px";
  fileInput.style.margin = "20px";
  var controlsContainer = document.querySelector(".leftContainer");
  controlsContainer.appendChild(fileInput);

  fileInput.addEventListener("change", function (e) {
    console.log("File input changed.");
    //e.target.files：首先檢查 files 對象是否存在
    //e.target.files[0]：這個檢查確保列表中至少有一個文件
    if (e.target.files && e.target.files[0]) {
      //創建一個 FileReader 對象，用於讀取用戶上傳的文件
      var reader = new FileReader();
      reader.onload = function (e) {
        //將讀取到的圖片數據設置為拼圖圖片的源，從而顯示用戶選擇的圖片
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

    // Clear the puzzle container 這樣shuffled過得piece不會重疊
    puzzleContainer.innerHTML = "";

    // Dynamically set the grid layout to match gridSize
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Calculate the width and height of each puzzle piece
    //因為是 3*3 拼圖, 所以要除以3
    var pieceWidth = puzzleImage.width / gridSize;
    var pieceHeight = puzzleImage.height / gridSize;

    //size of the puzzleContainer
    puzzleContainer.style.width = puzzleImage.width + "px";
    puzzleContainer.style.height = puzzleImage.height + "px";

    // index = > current index of array
    // i = > position of the index
    array.forEach((index, i) => {
      var row = Math.floor(index / gridSize); // xy軸點
      var col = index % gridSize;
      var piece = document.createElement("div"); //每一格puzzle piece

      piece.style.width = pieceWidth + "px";
      piece.style.height = pieceHeight + "px";
      piece.style.backgroundImage = `url('${imageUrl}')`;
      piece.style.backgroundSize = `${puzzleImage.width}px ${puzzleImage.height}px`;
      piece.style.backgroundPosition = `${-(col * pieceWidth)}px ${-(
        row * pieceHeight
      )}px`; //0*120 , 1*120 ...
      piece.style.border = "1px solid #333";
      piece.style.boxSizing = "border-box";

      //把index(8)變白色 but do not change color when is reset
      if (index === array.length - 1) {
        // Set the background color to white for the blank piece
        piece.style.backgroundColor = "white";
        piece.style.zIndex = "-10000";
      }
      if (isReset) {
        piece.style.backgroundColor = "";
        piece.style.zIndex = "";
      }

      //點擊圖片移動 => add click eventlistener
      piece.addEventListener("click", function () {
        // i => 元素的位置
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

  // 檢查洗牌後的排列是否有解
  // 空白格是數值最大的那塊 (array.length - 1)，計算反轉數時要排除它
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

    // 寬度是奇數 (3x3, 5x5)：反轉數必須是偶數
    if (gridWidth % 2 === 1) {
      return inversions % 2 === 0;
    }

    // 寬度是偶數 (4x4)：反轉數 + 空白格從底部數第幾列，必須是奇數
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
  //先判斷拼圖能不能動
  function IsMove(clickIndex, blankIndex) {
    //拿到點擊的圖片的位置
    var clickRow = Math.floor(clickIndex / gridSize); // result = 1
    var clickCol = clickIndex % gridSize; // result = 2

    //拿到空白圖片的位置
    var blankRow = Math.floor(blankIndex / gridSize); //result = 2
    var blankCol = blankIndex % gridSize; //result = 2

    // var dontMoveRow = Math.floor((gridSize * gridSize - 1) / gridSize);// result = 2 計算最後一行的第一個拼圖的行索引
    // var dontMoveCol = (gridSize * gridSize - 1) % gridSize;

    if (clickRow == blankRow && Math.abs(clickCol - blankCol) == 1) {
      return true;
    } else if (clickCol == blankCol && Math.abs(clickRow - blankRow) == 1) {
      return true;
    }
  }

  function MovePiece(clickIndex) {
    var blankPuzzlePiece = array.indexOf(array.length - 1);

    // 如果遊戲在reset中移動，顯示警告
    if (isReset) {
      alert("Please click on START button to start the game ~");
      // This stops the function if the game is reset
      // 停止執行： 當遇到 return 時，函數會停止執行其餘的代碼。
      //這裡的return 返回值: undefined
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

      // 更新拼圖顯示
      GetPuzzlePieces();

      //延遲檢查拼圖是否完成，給予拼圖塊移動和重新渲染足夠的時間
      setTimeout(FinishPuzzle, 300);
    }
  }
  //完成拼圖 跳出彈幕
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
