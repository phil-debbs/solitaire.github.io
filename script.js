// create a checkerboard
let checkerboard = document.getElementById("checkerboard");
const movesDiv = document.getElementById("moves");
const exemptIndices = [0, 1, 5, 6];
const undoStack = [];
const undoButton = document.getElementById("undo");
const resetButton = document.getElementById("reset");
const winButton = document.getElementById("win");
const buttons = document.querySelectorAll(".ripple");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const x = e.clientX;
    const y = e.clientY;

    const buttonTop = e.target.offsetTop;
    const buttonLeft = e.target.offsetLeft;

    const xInside = x - buttonLeft;
    const yInside = y - buttonTop;

    const circle = document.createElement("span");
    circle.classList.add("circle");
    circle.style.top = yInside + "px";
    circle.style.left = xInside + "px";

    this.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 500);
  });
});

const size = 7;
let currentRow = 0;
let currentCol = 0;
const centerIndex = Math.floor(size / 2);
const winMoves = [
  {
    srcId: 38,
    destId: 24,
  },
  {
    srcId: 33,
    destId: 31,
  },
  {
    srcId: 46,
    destId: 32,
  },
  {
    srcId: 44,
    destId: 46,
  },
  {
    srcId: 25,
    destId: 39,
  },
  {
    srcId: 46,
    destId: 32,
  },
  {
    srcId: 31,
    destId: 33,
  },
  {
    srcId: 34,
    destId: 32,
  },
  {
    srcId: 27,
    destId: 25,
  },
  {
    srcId: 29,
    destId: 31,
  },
  {
    srcId: 16,
    destId: 30,
  },
  {
    srcId: 37,
    destId: 23,
  },
  {
    srcId: 14,
    destId: 16,
  },
  {
    srcId: 28,
    destId: 14,
  },
  {
    srcId: 17,
    destId: 15,
  },
  {
    srcId: 14,
    destId: 16,
  },
  {
    srcId: 19,
    destId: 17,
  },
  {
    srcId: 4,
    destId: 18,
  },
  {
    srcId: 2,
    destId: 4,
  },
  {
    srcId: 25,
    destId: 11,
  },
  {
    srcId: 4,
    destId: 18,
  },
  {
    srcId: 17,
    destId: 19,
  },
  {
    srcId: 20,
    destId: 18,
  },
  {
    srcId: 9,
    destId: 11,
  },
  {
    srcId: 16,
    destId: 30,
  },
  {
    srcId: 11,
    destId: 25,
  },
  {
    srcId: 25,
    destId: 23,
  },
  {
    srcId: 23,
    destId: 37,
  },
  {
    srcId: 32,
    destId: 30,
  },
  {
    srcId: 37,
    destId: 23,
  },
  {
    srcId: 22,
    destId: 24,
  },
];

let isReset = false;

undoButton.disabled = true;
resetButton.disabled = true;

function watch(val) {
  return new Proxy(JSON.parse('{"watch":' + val + "}"), {
    set: function (target, property, value) {
      movesDiv.innerText = `Moves: ${value}`;
      target[property] = value;
      if (value >= 1) {
        undoButton.disabled = false;
        resetButton.disabled = false;
      }
    },
  });
}
const moves = watch(0);

resetButton.addEventListener("click", () => {
  isReset = true;
  resetBoard();
  createBoard();
  undoButton.disabled = true;
  resetButton.disabled = true;
});
undoButton.addEventListener("click", () => {
  isReset = false;
  if (!undoStack || undoStack.length === 0) {
    return false;
  }
  const { srcId, destId } = undoStack.pop();
  //at this point the destination Id becomes the source since we are undoing. so swap
  const dest = parseInt(srcId);
  const src = destId;

  const { isValid, immediateId } = checkMoveValidity(src, dest);
  if (isValid) {
    //count moves
    moves.watch--;
    const immediateBoard = document.getElementById(`${immediateId}`);

    const destBoard = document.getElementById(`${dest}`);
    const srcBoard = document.getElementById(`${src}`);
    const immediateMarble = createMarble(immediateId);
    immediateBoard.appendChild(immediateMarble);
    // const draggable = document.getElementById(dragId);
    // if (!e.target.draggable) {
    // add it to the drop target
    const destMarble = createMarble(dest);
    destBoard.appendChild(destMarble);
    srcBoard.removeChild(srcBoard.firstChild);
    // undoStack.push({ dest, src });
    // }
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetBoard() {
  checkerboard.innerHTML = "";
  moves.watch = 0;
}

winButton.addEventListener("click", async () => {
  isReset = false;
  resetBoard();
  createBoard();
  undoButton.disabled = true;
  winButton.disabled = true;
  for (const move of winMoves) {
    if (isReset) {
      resetBoard();
      createBoard();
      break;
    }
    await sleep(1000);
    const { srcId, destId } = move;
    const { isValid, immediateId } = checkMoveValidity(srcId, destId);
    if (isValid) {
      //count moves
      moves.watch++;
      const immediateBoard = document.getElementById(`${immediateId}`);
      const destBoard = document.getElementById(`${destId}`);
      const srcBoard = document.getElementById(`${srcId}`);
      srcBoard.firstChild.classList.add("selected");
      immediateBoard.firstChild.classList.add("immediate-marble");
      const destMarble = createMarble(destId);
      await sleep(500);
      srcBoard.firstChild.classList.remove("selected");
      await sleep(500);
      immediateBoard.removeChild(immediateBoard.firstChild);

      destBoard.appendChild(destMarble);

      // await sleep(500);
      srcBoard.removeChild(srcBoard.firstChild);
    }
  }
  undoButton.disabled = false;
  winButton.disabled = false;
});

function getRowCol(index) {
  const r = Math.floor(index / size);
  //Col is found by the modulus of the ith index over size.
  const c = index % size;
  return { irow: r, icol: c };
}

//create a marble div
function createMarble(id) {
  const marblediv = document.createElement("div");
  marblediv.id = id + "c";
  marblediv.draggable = true;
  marblediv.classList.add("marble");
  marblediv.addEventListener("dragstart", function (e) {
    // set the draggable element
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ dragId: e.target.id, srcId: e.target.parentNode.id })
    );
    this.className += " hold";
  });
  // marblediv.addEventListener("touchmove", function (e) {
  //   // set the draggable element
  //   // e.dataTransfer.setData(
  //   //   "text/plain",
  //   //   JSON.stringify({ dragId: e.target.id, srcId: e.target.parentNode.id })
  //   // );
  //   // this.className += " hold";
  //   console.log(e);
  // });
  marblediv.addEventListener("dragend", dragEnd);
  // marblediv.addEventListener("touchend", function (e) {
  //   // current box position.
  //   // var x = parseInt(box.style.left);
  //   // var y = parseInt(box.style.top);
  //   console.log(e);
  // });

  return marblediv;
}

function createBoard() {
  resetBoard();
  //add row container for dent on same row
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  checkerboard.appendChild(rowDiv);
  for (let i = 0; i < Math.pow(size, 2); i++) {
    //create a dent div
    const div = document.createElement("div");
    div.classList.add("dent");
    div.addEventListener("dragover", dragOver);
    div.addEventListener("dragenter", dragEnter);
    div.addEventListener("dragleave", dragLeave);
    //mobile events
    div.addEventListener("touchstart", function (e) {
      // set the draggable element
      // e.dataTransfer.setData(
      //   "text/plain",
      //   JSON.stringify({ dragId: e.target.id, srcId: e.target.parentNode.id })
      // );
      // this.className += " hold";
      //
      const selected = document.querySelector(".selected");
      if (selected && selected.id === e.target.id) {
        //clicked an already selected marble, so deselect it
        e.target.classList.remove("selected");
      } else if (selected && selected.id !== e.target.id) {
        //clicked a different location
        //check for validity
        const destId = e.target.id;
        const srcId = selected.parentNode.id;
        const { isValid, immediateId } = checkMoveValidity(srcId, destId);
        if (isValid) {
          selected.classList.remove("selected");
          moves.watch++;
          const immediateBoard = document.getElementById(`${immediateId}`);
          const destBoard = document.getElementById(`${destId}`);
          const srcBoard = document.getElementById(`${srcId}`);
          srcBoard.firstChild.classList.add("selected");
          immediateBoard.firstChild.classList.add("immediate-marble");
          const destMarble = createMarble(destId);
          srcBoard.firstChild.classList.remove("selected");
          immediateBoard.removeChild(immediateBoard.firstChild);

          destBoard.appendChild(destMarble);
          destMarble.classList.remove("selected");
          srcBoard.removeChild(srcBoard.firstChild);
          const sel = document.querySelector(".selected");
          return false;
        } else {
          //unselect source
          selected.classList.remove("selected");
        }
      } else {
        if (e.target.className.includes("marble")) {
          e.target.classList.add("selected");
        }
      }
    });

    //add an id for each dent div
    div.id = i;
    //create a marble div
    const marblediv = createMarble(i);

    div.addEventListener("drop", function (e) {
      //https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
      // get the draggable element
      const { dragId, srcId } = JSON.parse(
        e.dataTransfer.getData("text/plain")
      );
      const destId = parseInt(e.target.id);
      const { isValid, immediateId } = checkMoveValidity(srcId, destId);
      if (isValid) {
        //count moves
        moves.watch++;
        const immediateBoard = document.getElementById(`${immediateId}`);
        immediateBoard.removeChild(immediateBoard.firstChild);
        const draggable = document.getElementById(dragId);
        if (!e.target.draggable) {
          // add it to the drop target
          e.target.appendChild(draggable);
          undoStack.push({ srcId: parseInt(srcId), destId });
        }
      }
    });
    //since we are using a one dimensional array for a two dimensional board, we calculate the row and the column to assign the appropriate color
    //Row is found by dividing the ith index by size and taking the lower bound.
    // const irow = Math.floor(i / size);
    //Col is found by the modulus of the ith index over size.
    // const icol = i % size;
    //when irow is != row, then the row has changed. So we make irow the current row.
    const { irow, icol } = getRowCol(i);

    if (currentRow !== irow) {
      rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      checkerboard.appendChild(rowDiv);
      currentRow = irow;
    }
    div.classList.add("dent");

    //exclude putting marble in center dent
    /**
     * Here,
     */
    if (i !== centerIndex * size + centerIndex) {
      if (exemptIndices.includes(irow) && exemptIndices.includes(icol)) {
        div.classList.add("invisible");
      } else {
        div.appendChild(marblediv);
      }
    }

    rowDiv.appendChild(div);
  }
}

createBoard();

function checkMoveValidity(srcId, destId) {
  //get row/col details of the source
  const src = getRowCol(srcId);
  const srcRow = src.irow;
  const srcCol = src.icol;

  //get dest element and check if it has a classname of dent
  const destEle = document.getElementById(destId);
  if (!destEle.className.includes("dent")) {
    return { isValid: false };
  }
  //get row/col details of the dest
  const dest = getRowCol(destId);
  const destRow = dest.irow;
  const destCol = dest.icol;

  //ensure the destination is either on same row or same col. No diagonal move is allowed
  if (srcRow === destRow || srcCol === destCol) {
    const immediateRow =
      srcRow < destRow ? srcRow + 1 : srcRow > destRow ? srcRow - 1 : srcRow;
    const immediateCol =
      srcCol < destCol ? srcCol + 1 : srcCol > destCol ? srcCol - 1 : srcCol;

    //use the row and col to get the dent
    const immediateId = immediateRow * size + immediateCol;
    const immediateBoard = document.getElementById(`${immediateId}`);

    const validNeighbour =
      Math.abs(srcRow - destRow) === 2 || Math.abs(srcCol - destCol) === 2;

    const isValid = validNeighbour; //&& immediateBoard.firstChild;

    return { isValid, immediateId };
  } else {
    return {};
  }
}

function dragEnd(e) {
  e.preventDefault();
}

function dragOver(e) {
  //check if element is valid drop target
  //Call the event.preventDefault() on the dragenter and dragover event handlers to make an element a valid drop target.
  if (!e.target.draggable) e.preventDefault();
}

function dragEnter(e) {
  //check if element is valid drop target
  //Call the event.preventDefault() on the dragenter and dragover event handlers to make an element a valid drop target.
  if (!e.target.draggable) e.preventDefault();
  // e.preventDefault();
  // this.className += " hovered";
}

function dragLeave(e) {
  // this.className = "empty";
}
