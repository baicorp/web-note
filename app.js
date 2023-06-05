document.addEventListener("DOMContentLoaded", async () => {
  let noteDatabase = [];
  let cardId = -1;
  loadFromLocalStorage();

  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=50"
  );
  const data = await response.json();
  console.log(data);
  renderNoteFetch(data);

  const dialogTitle = document.querySelector("#d-title");
  const dialogContent = document.querySelector("#d-content");
  const editableTextArea = document.querySelectorAll(".textarea");
  const colorScheme = document.querySelector(".color__scheme");
  const color = document.querySelectorAll(".color");
  const formBackground = document.querySelector(".dialog__form");

  function createCard(id, bgColor, title, content, pinned) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("id", `${id}`);
    card.style.backgroundColor = bgColor;
    const cardPinnedIcon = document.createElement("img");
    cardPinnedIcon.setAttribute("class", "pin__logo");
    if (pinned) cardPinnedIcon.style.display = "block";

    cardPinnedIcon.addEventListener("click", (e) => {
      pinNote(id);
      e.stopPropagation();
    });

    cardPinnedIcon.setAttribute("src", "./assets/image/pinned.png");
    const cardHeader = document.createElement("header");
    cardHeader.setAttribute("class", "card__header");
    const cardHeaderTitle = document.createElement("h3");
    cardHeaderTitle.setAttribute("class", "card__header__title");
    cardHeaderTitle.innerText = title;
    const cardDeleteBtn = document.createElement("img");
    cardDeleteBtn.setAttribute("id", "deleteBtn");
    cardDeleteBtn.setAttribute("src", "./assets/image/trash.png");
    cardHeader.appendChild(cardHeaderTitle);
    cardHeader.appendChild(cardDeleteBtn);
    const cardContent = document.createElement("p");
    cardContent.setAttribute("class", "card__content");
    cardContent.innerText = content;
    card.appendChild(cardPinnedIcon);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);

    card.addEventListener("click", () => {
      openNote(id);
    });

    cardDeleteBtn.addEventListener("click", (e) => {
      deleteNote(id);
      e.stopPropagation();
    });
    return card;
  }

  function createNote(id, bgColor, title, content, pinned) {
    const card = createCard(id, bgColor, title, content, pinned);
    return card;
  }

  function editNote(cardId, bgColor, title, content) {
    const card = selectCardFromId(cardId);
    const cardTitle = card.children[1].firstChild;
    const cardContent = card.lastChild;
    card.style.backgroundColor = bgColor;
    cardTitle.innerText = title;
    cardContent.innerText = content;
  }

  function deleteNote(id) {
    const indexDatabase = findId(id, noteDatabase);
    noteDatabase = noteDatabase.filter(
      (element) => element != noteDatabase[indexDatabase]
    );
    renderNote(noteDatabase);
    localStorage.setItem("noteDatabase", JSON.stringify(noteDatabase));
  }

  function openNote(id) {
    const card = selectCardFromId(id);
    const cardBackgroundColor = card.style.backgroundColor;
    const cardTitle = card.children[1].firstChild;
    const cardContent = card.lastChild;
    cardId = id;
    formBackground.style.backgroundColor = cardBackgroundColor;
    dialogTitle.innerText = cardTitle.innerText;
    dialogContent.innerText = cardContent.innerText;
    selectColor(cardBackgroundColor);
    dialog.showModal();
  }

  function pinNote(id) {
    const card = selectCardFromId(id);
    const pinnedElement = card.firstChild;
    pinnedElement.style.display = "block";
    noteDatabase = noteDatabase.map((note) => {
      return note.id === id ? { ...note, pinned: !note.pinned } : note;
    });
    renderNote(noteDatabase);
    localStorage.setItem("noteDatabase", JSON.stringify(noteDatabase));
  }

  function selectCardFromId(cardId) {
    const cards = document.querySelectorAll(".card");
    const arrayOfCard = Array.from(cards);
    const card = arrayOfCard.filter((card) => parseInt(card.id) === cardId);
    return card[0];
  }

  function loadFromLocalStorage() {
    if (typeof Storage === "undefined") {
      alert("Your browser does not support web storage");
      return;
    }
    if (JSON.parse(localStorage.getItem("noteDatabase")) != null) {
      noteDatabase = JSON.parse(localStorage.getItem("noteDatabase"));
      renderNote(noteDatabase);
    }
  }

  function renderNote(noteDatabase) {
    const unpinnedNote = document.querySelector(".unpinned__content");
    const pinnedNote = document.querySelector(".pinned__content");
    unpinnedNote.innerHTML = "";
    pinnedNote.innerHTML = "";
    const header = document.createElement("h2");
    const header2 = document.createElement("h2");
    header.innerText = "Pinned Note";
    pinnedNote.append(header);
    header2.innerText = "Note";
    unpinnedNote.append(header2);
    noteDatabase.forEach((noteObject) => {
      const note = createNote(
        noteObject.id,
        noteObject.bgColor,
        noteObject.title,
        noteObject.content,
        noteObject.pinned
      );
      if (noteObject.pinned === false) {
        unpinnedNote.appendChild(note);
      } else {
        pinnedNote.appendChild(note);
      }
    });
    const content = document.querySelectorAll(".card__content");
    const card = document.querySelectorAll(".card");
    tidyUp(content, card);
  }
  function renderNoteFetch(noteDatabase) {
    const unpinnedNote = document.querySelector(".unpinned__content");
    const pinnedNote = document.querySelector(".pinned__content");
    unpinnedNote.innerHTML = "";
    pinnedNote.innerHTML = "";
    const header = document.createElement("h2");
    const header2 = document.createElement("h2");
    header.innerText = "Pinned Note";
    pinnedNote.append(header);
    header2.innerText = "Note";
    unpinnedNote.append(header2);
    const color = [
      "rgb(141, 212, 155)",
      "rgb(203, 240, 248)",
      "rgb(230, 201, 168)",
      "rgb(253, 207, 232)",
      "rgb(215, 174, 251)",
      "rgb(255, 183, 111)",
    ];
    noteDatabase.forEach((noteObject) => {
      const random = Math.floor(Math.random() * 6) + 1;
      const note = createNote(
        noteObject.id,
        color[random],
        noteObject.title,
        noteObject.body,
        false
      );
      unpinnedNote.appendChild(note);
    });
    const content = document.querySelectorAll(".card__content");
    const card = document.querySelectorAll(".card");
    tidyUp(content, card);
  }

  const dialog = document.querySelector("dialog");

  function selectColor(bgColor) {
    color.forEach((col) => {
      const getClassColorElement = document.querySelector(
        `.${col.classList[1]}`
      );
      const getBgColor = getComputedStyle(getClassColorElement).backgroundColor;
      if (getBgColor === bgColor) {
        col.classList.add("selected__color");
      } else {
        col.classList.remove("selected__color");
      }
    });
  }

  function resetDialog() {
    editableTextArea.forEach((element) => {
      element.innerText = "";
    });
    formBackground.style.backgroundColor = "white";
    color.forEach((color) => {
      color.classList.remove("selected__color");
    });
    color[0].classList.add("selected__color");
    colorScheme.classList.remove("show");
    cardId = -1;
  }

  function findId(id, database) {
    for (let i = 0; i < database.length; i++) {
      if (id == database[i].id) {
        return i;
      }
    }
    return -100;
  }

  function saveDataToDatabase(id, bgColor, title, content, pinned) {
    const indexId = findId(id, noteDatabase);
    if (indexId >= 0) {
      noteDatabase[indexId].bgColor = bgColor;
      noteDatabase[indexId].title = title;
      noteDatabase[indexId].content = content;
      noteDatabase[indexId].pinned = pinned;
    } else {
      noteDatabase.push({
        id: id,
        bgColor: bgColor,
        title: title,
        content: content,
        pinned: pinned,
      });
    }
    localStorage.setItem("noteDatabase", JSON.stringify(noteDatabase));
  }

  function tidyUp() {
    const content = document.querySelectorAll(".card__content");
    const card = document.querySelectorAll(".card");
    content.forEach((element, i) => {
      if (element.innerText.length > 250) {
        card[i].style.gridRow = "span 3";
      } else if (element.innerText.length > 125) {
        card[i].style.gridRow = "span 2";
      }
    });
  }

  const addNoteBtn = document.querySelector("[data-add-note-btn]");
  addNoteBtn.addEventListener("click", () => {
    saveDialogBtn.disabled = true;
    resetDialog();
    dialog.showModal();
  });

  const saveDialogBtn = document.querySelector(".save__btn");
  saveDialogBtn.addEventListener("click", () => {
    const color = getComputedStyle(formBackground);
    const bgColor = color.backgroundColor;
    const title = dialogTitle.innerText.trim();
    const content = dialogContent.innerText.trim();
    const pinned = false;
    if (cardId < 0) {
      cardId = +new Date();
      createNote(cardId, bgColor, title, content);
    } else {
      editNote(cardId, bgColor, title, content);
    }
    saveDataToDatabase(cardId, bgColor, title, content, pinned);
    renderNote(noteDatabase);
    tidyUp();
    resetDialog();
  });

  const cancelDialogBtn = document.querySelector(".cancel__btn");
  cancelDialogBtn.addEventListener("click", () => {
    saveDialogBtn.disabled = false;
    dialog.close();
  });

  const paletteBtn = document.querySelector(".color__palette__icon");
  paletteBtn.addEventListener("click", () => {
    colorScheme.classList.toggle("show");
  });

  editableTextArea.forEach((text) => {
    text.addEventListener("paste", (e) => {
      e.preventDefault();
      let clearText = e.clipboardData.getData("text/plain");
      document.execCommand("inserttext", false, clearText);
    });
  });

  editableTextArea[0].addEventListener("input", () => {
    if (
      editableTextArea[0].innerText.trim() === "" &&
      editableTextArea[1].innerText.trim() === ""
    ) {
      saveDialogBtn.disabled = true;
    } else {
      saveDialogBtn.disabled = false;
    }
  });
  editableTextArea[1].addEventListener("input", () => {
    if (
      editableTextArea[0].innerText.trim() === "" &&
      editableTextArea[1].innerText.trim() === ""
    ) {
      saveDialogBtn.disabled = true;
    } else {
      saveDialogBtn.disabled = false;
    }
  });

  color.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.toggle("selected__color");
      const getClassColorElement = document.querySelector(
        `.${element.classList[1]}`
      );
      const getBgColor = getComputedStyle(getClassColorElement).backgroundColor;
      formBackground.style.backgroundColor = getBgColor;
      color.forEach((color) => {
        if (element != color) {
          color.classList.remove("selected__color");
        }
      });
    });
  });

  const bodyContent = document.querySelector(".unpinned__content");
  const searchInput = document.querySelector(".search__input");
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      bodyContent.innerHTML = "";
      const sectionTitle = document.createElement("h2");
      sectionTitle.innerText = "Note";
      bodyContent.append(sectionTitle);
      renderNote(noteDatabase);
      tidyUp();
    }
  });

  const searchBtn = document.querySelector(".search__btn");
  searchBtn.addEventListener("click", () => {
    let dataSet = new Set();
    const inputText = searchInput.value.toLowerCase();
    noteDatabase.forEach((note) => {
      if (
        note.title.toLowerCase().includes(inputText) ||
        note.content.toLowerCase().includes(inputText)
      ) {
        dataSet.add(note);
      }
    });
    renderNote(dataSet);
    tidyUp();
  });
});
