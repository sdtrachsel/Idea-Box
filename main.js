var savedBtn = document.querySelector('.js-save');
var titleInput = document.querySelector('.js-title-input');
var bodyInput = document.querySelector('.js-body-input');
var ideaContainer = document.querySelector('.js-idea-container');
var formContainer = document.querySelector('.js-form');
var showStarredBtn = document.querySelector('.js-show-btn');
var showAllBtn = document.querySelector('.js-show-all-btn');
var searchBar = document.querySelector('.search');

var savedIdeas = [];

ideaContainer.addEventListener('click', starORDelete);
showStarredBtn.addEventListener('click', filterStarred);
showAllBtn.addEventListener('click', showAllIdeas);
savedBtn.addEventListener('click', saveNewIdea);
formContainer.addEventListener('input', activateSaveBtn);
searchBar.addEventListener('input', filterText);

function activateSaveBtn() {
    if (bodyInput.value !== "" && titleInput.value !== "") {
        savedBtn.disabled = false;
    } else {
        savedBtn.disabled = true;
    }
}

function saveNewIdea() {
    hide(showAllBtn);
    show(showStarredBtn);
    createIdea();
    clearInput();
    repopulateIdeaContainer(savedIdeas);
    savedBtn.disabled = true;
}

function createIdea() {
    var title = titleInput.value;
    var body = bodyInput.value;
    var newIdea = new Idea(title, body);
    newIdea.saveToStorage();
}

function clearInput() {
    titleInput.value = '';
    bodyInput.value = '';
}

function repopulateIdeaContainer(ideas) {
    event.preventDefault();
    createCardHtml(ideas);
}

function createCardHtml(ideas) {
    ideaContainer.innerHTML = '';

    for (var i = 0; i < ideas.length; i++) {
        ideaContainer.innerHTML += `
        <div class="card" id="${ideas[i].id}">
        <header class="card-header">
          <img class="star js-star" id="star" src="${ideas[i].starIcon()}">
          <img class="delete js-delete" id="delete" src="assests/delete.svg">
        </header>
        <div class="card-text-container">
          <h2 class="header card-title">${ideas[i].title}</h2>
          <p class="card-text"> ${ideas[i].body}</p>
        </div>
        <div class="comment"></div>
      </div>`;
    }
}

function showAllIdeas() {
    toggleStarORAllBtn();
    updateSearchPlaceholder('Search Ideas');
    repopulateIdeaContainer(savedIdeas);
}

function filterStarred() {
    toggleStarORAllBtn();
    updateSearchPlaceholder('Search Starred Ideas');
    createCardHtml(createStarredList());
}

function toggleStarORAllBtn() {
    if (showStarredBtn.classList.contains('hidden')) {
        show(showStarredBtn);
        hide(showAllBtn);
    } else if (!showStarredBtn.classList.contains('hidden')) {
        show(showAllBtn);
        hide(showStarredBtn);
    }
}

function updateSearchPlaceholder(text) {
    searchBar.value = '';
    searchBar.placeholder = `${text}`;
}

function createStarredList() {
    var starredIdeas = [];
    for (var i = 0; i < savedIdeas.length; i++) {
        if (savedIdeas[i].star) {
            starredIdeas.push(savedIdeas[i]);
        }
    } return starredIdeas;
}

function starORDelete(event) {
    if (event.target.id === 'star') {
        savedIdeas[findIndex()].updateIdea(findIndex());
    } else if (event.target.id === 'delete') {
        savedIdeas[findIndex()].deleteFromStorage(findIndex());
    }

    if (showStarredBtn.classList.contains('hidden')) {
        repopulateIdeaContainer(createStarredList());
    } else {
        repopulateIdeaContainer(savedIdeas);
    }
}

function findIndex() {
    for (var i = 0; i < savedIdeas.length; i++) {
        if (savedIdeas[i].id === event.target.parentElement.parentElement.id) {
            return i;
        }
    }
}

function filterText() {
    var currentSearch = searchBar.value.toLowerCase();
    var results = [];

    for (i = 0; i < savedIdeas.length; i++) {
        var lowerSavedTitle = savedIdeas[i].title.toLowerCase();
        var lowerSavedBody = savedIdeas[i].body.toLowerCase();

        if ((lowerSavedTitle.includes(currentSearch) || lowerSavedBody.includes(currentSearch)) && !showStarredBtn.classList.contains('hidden')) {
            results.push(savedIdeas[i]);
        } else if ((lowerSavedTitle.includes(currentSearch) || lowerSavedBody.includes(currentSearch)) && showStarredBtn.classList.contains('hidden') && savedIdeas[i].star) {
            results.push(savedIdeas[i])
        } else {
            ideaContainer.innerHTML = '';
        }
    }
    createCardHtml(results);
}

function show(element) {
    element.classList.remove('hidden');
}

function hide(element) {
    element.classList.add('hidden');
}