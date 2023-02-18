const initialState = [];
let matchId = 1;
let selectedMatchId;
let seletedMatch;

const matchesReducer = (state = initialState, action) => {
  if (action.type === "increment") {
    const { matchId, incrementBy } = action.payload;
    const match = state.find((match) => match.id === matchId);
    const newState = state.slice();
    const index = newState.indexOf(match);
    const updateMatch = { ...match, total: match.total + incrementBy };
    newState[index] = updateMatch;
    return newState;
  } else if (action.type === "decrement") {
    const { matchId, decrementBy } = action.payload;
    const match = state.find((match) => match.id === matchId);
    const newState = state.slice();
    const index = newState.indexOf(match);
    const updateMatch = {
      ...match,
      total: match.total - decrementBy < 0 ? 0 : match.total - decrementBy,
    };
    newState[index] = updateMatch;
    return newState;
  } else if (action.type === "addMatch") {
    const newState = [...state, action.payload];
    return newState;
  } else if (action.type === "reset") {
    return state.map((match) => {
      return { ...match, total: 0 };
    });
  } else if (action.type === "remove_match") {
    const copyState = state.slice();
    const newState = copyState.filter((m) => m.id !== action.payload);
    return newState;
  } else {
    return state;
  }
};

const store = Redux.createStore(matchesReducer);

store.dispatch({
  type: "addMatch",
  payload: { id: 1, total: 0 },
});

store.subscribe(() => {
  const state = store.getState();
//   console.log({ state });
});

const allMatchesContainer = document.querySelector(".all-matches.container");
const firstChild = allMatchesContainer.children[0];
if (firstChild.nodeType === Node.ELEMENT_NODE) {
  firstChild.setAttribute("matchId", 1);
}

allMatchesContainer.addEventListener("click", function (event) {
  const target = event.target;
  if (
    target.classList.contains("lws-increment") ||
    target.classList.contains("lws-decrement") ||
    target.classList.contains("lws-delete")
  ) {
    seletedMatch = target.closest(".match");
    selectedMatchId = Number(seletedMatch.getAttribute("matchId"));
  }
});

//Delete Button handler
handleDeleteButton = (event) => {
  const matchSection = event.target.closest(".match");
  clearHandleDeleteButtonListeners();
  store.dispatch({
    type: "remove_match",
    payload: Number(matchSection.getAttribute("matchId")),
  });
  const match = document.querySelector(
    `div[matchId='${Number(matchSection.getAttribute("matchId"))}']`
  );
  match.remove();
  addHandleDeleteButtonListeners();
};

function clearHandleDeleteButtonListeners() {
  const deleteButtons = document.querySelectorAll(".lws-delete");
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", handleDeleteButton);
  });
}

function addHandleDeleteButtonListeners() {
  const deleteButtons = document.querySelectorAll(".lws-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteButton);
  });
}
addHandleDeleteButtonListeners();

const addMatchBtn = document.querySelector(".lws-addMatch");
const matchesContainer = document.querySelector(".all-matches");
if (firstChild.nodeType === Node.ELEMENT_NODE) {
  const increment = firstChild.querySelector("input.lws-increment");
  increment.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      store.dispatch({
        type: "increment",
        payload: {
          matchId: selectedMatchId,
          incrementBy: Number(e.target.value),
        },
      });
      renderUI(store, selectedMatchId);
    }
  });

  const decrement = firstChild.querySelector("input.lws-decrement");
  decrement.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      store.dispatch({
        type: "decrement",
        payload: {
          matchId: selectedMatchId,
          decrementBy: Number(e.target.value),
        },
      });
      renderUI(store, selectedMatchId);
    }
  });
}
const incrementInputs = document.querySelectorAll(".lws-increment");
const decrementInputs = document.querySelectorAll(".lws-decrement");
const resetBtn = document.querySelector(".lws-reset");

function resetUI() {
  store.dispatch({ type: "reset" });
  const container = document.querySelector(".all-matches");
  const containers = container.getElementsByClassName("match");
  for (let i = 0; i < containers.length; i++) {
    containers[i].childNodes[5].childNodes[1].innerText = 0;
    const increment  = containers[i].getElementsByClassName('lws-increment')
    increment[0].value = 0;
    const decrement  = containers[i].getElementsByClassName('lws-decrement')
    decrement[0].value = 0;
  }
}
resetUI();
resetBtn.addEventListener("click", resetUI);

function renderUI(store, selectedMatchId) {
  const state = store.getState();
  const match = state.find((match) => match.id === selectedMatchId);
  if (seletedMatch && match) {
    const result = seletedMatch.querySelector(".lws-singleResult");
    result.innerText = match.total;
  }
}

function addButtonListener(store) {
  addMatchBtn.addEventListener("click", () => {
    clearHandleDeleteButtonListeners();
    const matchesContainer = document.querySelector(".all-matches");

    const newMatch = document.createElement("div");
    newMatch.classList.add("match");
    newMatch.setAttribute(`matchId`, ++matchId);
    newMatch.innerHTML = `
        <div class="wrapper">
          <button class="lws-delete">
            <img src="./image/delete.svg" alt="" />
          </button>
          <h3 class="lws-matchName">Match ${matchId}</h3>
        </div>
        <div class="inc-dec">
          <form class="incrementForm">
            <h4>Increment</h4>
            <input type="number" name="increment" class="lws-increment" />
          </form>
          <form class="decrementForm">
            <h4>Decrement</h4>
            <input type="number" name="decrement" class="lws-decrement" />
          </form>
        </div>
        <div class="numbers">
          <h2 class="lws-singleResult">0</h2>
        </div>
      `;
    matchesContainer.appendChild(newMatch);
    resetUI()
    addHandleDeleteButtonListeners();
    const state = store.getState();
    store.dispatch({
      type: "addMatch",
      payload: { id: matchId, total: 0 },
    });
    addEventListenersForNewMatch(state.length);
  });
}

function addEventListenersForNewMatch(index) {
  const incrementInputs = document.querySelectorAll(".lws-increment");
  const decrementInputs = document.querySelectorAll(".lws-decrement");

  incrementInputs[index].addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      store.dispatch({
        type: "increment",
        payload: {
          matchId: selectedMatchId,
          incrementBy: Number(e.target.value),
        },
      });
      renderUI(store, selectedMatchId);
    }
  });

  decrementInputs[index].addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      store.dispatch({
        type: "decrement",
        payload: {
          matchId: selectedMatchId,
          decrementBy: Number(e.target.value),
        },
      });

      renderUI(store, selectedMatchId);
    }
  });
}
function appInit(store) {
  addButtonListener(store);
}

appInit(store);
