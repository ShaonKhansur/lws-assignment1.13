const initialState = [];
let matchId = 1;
let selectedMatchId;
let seletedMatch;

const matchesReducer = (state = initialState, action) => {
  if (action.type === "increment") {
    console.log({ action, currentState: state });
    const { matchId, incrementBy } = action.payload;
    const match = state.find((match) => match.id === matchId);
    const newState = state.slice();
    const index = newState.indexOf(match);
    const updateMatch = { ...match, total: match.total + incrementBy };
    newState[index] = updateMatch;
    return newState;
  } else if (action.type === "decrement") {
    // console.log({ action, currentState: state });
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
    console.log(action.payload);
    const newState = state.slice();
    newState.splice(action.payload, 1);
    return newState;

    // return newState.splice(action.payload, 1);
  } else {
    return state;
  }
};

const store = Redux.createStore(matchesReducer);

store.dispatch({
  type: "addMatch",
  payload: { id: 1, increment: 0, decrement: 0, total: 0 },
});

store.subscribe(() => {
  const s = store.getState();
  console.log({ s });
});

const allMatchesContainer = document.querySelector('.all-matches.container');
const firstChild = allMatchesContainer.children[0];
if (firstChild.nodeType === Node.ELEMENT_NODE) { 
    firstChild.setAttribute("matchId", 1);
}


allMatchesContainer.addEventListener('click', function(event) {
    const target = event.target;
    if (target.closest('.match')) {
      const seletedMatch = target.closest('.match');
      console.log('seletedMatch', seletedMatch)
    // seletedMatch = seletedMatch;
    selectedMatchId = Number(seletedMatch.getAttribute('matchId'));

    // console.log('section:',seletedMatch);
      console.log('Selected match section:', seletedMatch);
    }
  });
// allMatchesContainer.addEventListener('click', function(event) {
//   const target = event.target;
//   if (target.classList.contains('lws-increment') || target.classList.contains('lws-decrement') || target.classList.contains('lws-delete')) {
//     seletedMatch = target.closest('.match');
//     console.log('seletedMatch', seletedMatch)
//     // seletedMatch = seletedMatch;
//     selectedMatchId = Number(seletedMatch.getAttribute('matchId'));

//     console.log('section:',seletedMatch);
//   }
// });

const addMatchBtn = document.querySelector(".lws-addMatch");
const matchesContainer = document.querySelector(".all-matches");
// const firstChild = matchesContainer.children[0];
if (firstChild.nodeType === Node.ELEMENT_NODE) { // Check if the first child node is an element node
    // firstChild.setAttribute("matchId", 1);
    const increment = firstChild.querySelector('input.lws-increment');
    increment.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            store.dispatch({
              type: "increment",
              payload: { matchId: selectedMatchId, incrementBy: Number(e.target.value) },
            });
            renderUI(store, selectedMatchId);
          }
    })
    console.log('increment F', increment)

    const decrement = firstChild.querySelector('input.lws-decrement');
    decrement.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            store.dispatch({
              type: "decrement",
              payload: { matchId: selectedMatchId, decrementBy: Number(e.target.value) },
            });
            renderUI(store, selectedMatchId);
          }
    })
    const deleteBtn = firstChild.querySelector('button.lws-delete');
    // deleteBtn.addEventListener("click", () => deleteEvent(deleteBtn, 0));
  }
const incrementInputs = document.querySelectorAll(".lws-increment");
const decrementInputs = document.querySelectorAll(".lws-decrement");
const resetBtn = document.querySelector(".lws-reset");
const deleteBtn = document.querySelector(".lws-delete");

function deleteEvent(btn, index) {
    // btn.removeEventListener('click',  deleteEvent)
    const container = document.querySelector(".all-matches");
    const matches = container.getElementsByClassName("match");
    // console.log({deletebtnind: index, btn, matches })

  //   console.log({ btn, index, matches });
  const dbtn = matches[index].getElementsByClassName("lws-delete");
//   matches[index].remove();
  //   console.log({index, state: store.getState()})
  store.dispatch({ type: "remove_match", payload: index });

  // container.removeChild()
  // container.removeChild(container[index]);
}

// deleteBtn.addEventListener('click', deleteEvent);

function resetUI() {
  store.dispatch({ type: "reset" });
  const container = document.querySelector('.all-matches')
  const containers = container.getElementsByClassName("match");
  console.log({containers})
  for (let i = 0; i < containers.length; i++) {
    containers[i].childNodes[5].childNodes[1].innerText = 0;
  }
}
resetBtn.addEventListener("click", resetUI);

function renderUI(store, selectedMatchId) {
  const state = store.getState();
  const match = state.find(match => match.id === selectedMatchId)
  if (seletedMatch && match) {
      const result = seletedMatch.querySelector('.lws-singleResult');
      result.innerText = match.total;
      console.log({a: seletedMatch})

  }
}

function addListenerForAllInputsField(store) {
  const incrementInputs = document.querySelectorAll(".lws-increment");
  const decrementInputs = document.querySelectorAll(".lws-decrement");
  const deleteButtons = document.querySelectorAll(".lws-delete");

  //   deleteButtons.forEach((btn, ind) => {
  //     btn.addEventListener("click", () => deleteEvent(btn, ind));
  //   });

  incrementInputs.forEach((input, indx) => {
    renderUI(store, indx);

    input.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        store.dispatch({
          type: "increment",
          payload: { matchId: selectedMatchId, incrementBy: Number(e.target.value) },
        });

        renderUI(store, indx);

        // const state = store.getState();
        // const match = state.find((match) => match.id === indx + 1);
        // const container = document.querySelector(".all-matches");
        // container.children[indx].childNodes[5].innerHTML = match.total;
        // console.log({container})
        // console.log({indx});
        // console.log(match);
        // container.childNodes[3].childNodes[5].childNodes[1].innerHTML = match.total;
        // const nextInput = document.querySelectorAll(".lws-decrement")[indx];
        // nextInput.focus();

        // console.log({ matchId, event: e, index: indx });
      }
    });
  });

  decrementInputs.forEach((input, indx) => {
    input.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        // handle Enter key pressed for increment input field
        e.preventDefault(); // prevent form submission
        store.dispatch({
          type: "decrement",
          payload: { matchId: selectedMatchId, decrementBy: Number(e.target.value) },
        });
        renderUI(store, indx);
        // const container = document.querySelector(".all-matches");
        // const state = store.getState();
        // const match = state.find((match) => match.id === indx + 1);
        // container.childNodes[3].childNodes[5].childNodes[1].innerHTML = match.total;
        // const incrementValue = parseInt(e.target.value);
        // dispatch increment action with matchId and incrementValue
      }
    });
  });
}
// addListenerForAllInputsField(store);

function addButtonListener(store) {
  addMatchBtn.addEventListener("click", () => {
    const matchesContainer = document.querySelector(".all-matches");

    const newMatch = document.createElement("div");
    newMatch.classList.add("match");
    newMatch.setAttribute(`matchId`, ++matchId)
    newMatch.innerHTML = `
        <div class="wrapper">
          <button class="lws-delete">
            <img src="./image/delete.svg" alt="" />
          </button>
          <h3 class="lws-matchName">Match ${
            matchId
          }</h3>
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
    const matches = document.querySelectorAll('.match');
    for (let i = 0; i < matches.length; i++) {
        console.log( matches[i].getAttribute('matchId'))
    }
    console.log(document.querySelectorAll('.match'))

    // const matchesContainer = document.querySelector(".all-matches");
    console.log({
      matchLength: matchesContainer.children.length,
      matchesContainer,
    });
    const state = store.getState();
    store.dispatch({
      type: "addMatch",
      payload: { id: matchId, increment: 0, decrement: 0, total: 0 },
    });
    addEventListenersForNewMatch(state.length);
    // console.log(matchesContainer?.children.length);
    // initialState.push({
    //   id: matchesContainer?.children.length,
    //   increment: 0,
    //   decrement: 0,
    //   total: 0,
    // });
    // console.log({ initialState });
    // console.log('add button store', store)
    // addListenerForAllInputsField(store);
  });
}

// function removeBtn() {

// }

function addEventListenersForNewMatch(index) {
  const incrementInputs = document.querySelectorAll(".lws-increment");
  const decrementInputs = document.querySelectorAll(".lws-decrement");
  const state = store.getState();
  const deleteButtons = document.querySelectorAll(".lws-delete");

  function removeBtn() {
    deleteEvent(deleteButtons[index], index);
  }
  // console.log('watch dbtins', {deleteButtons, index})
  deleteButtons[index].addEventListener("click", removeBtn);

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

      const container = document.querySelector(".all-matches");
      //   console.log({ container });
      //   console.log({ index });
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

  //   console.log({ input: incrementInputs, index });
}
// addButtonListener(store);

function appInit(store) {
//   addListenerForAllInputsField(store);
  addButtonListener(store);
}

appInit(store);
