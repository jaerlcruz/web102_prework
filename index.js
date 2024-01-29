/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game of games) {
    

        // create a new div element, which will become the game card
        const gamecard = document.createElement("div");

        // add the class game-card to the list
        gamecard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        gamecard.innerHTML = `
            <img src="${game.img}" class="game-img">
            <h3>${game.name}</h3>
            ${game.description}
            <br><br>
            Backers: ${game.backers}
            <br>
            $${game.pledged} pledged of $${game.goal} goal`;
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")


        // append the game to the games-container
        gamesContainer.appendChild(gamecard);
    }
}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);

// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const indiv_contributions = GAMES_JSON.reduce( (backers, game) => {
    return backers + game.backers;
}, 0);

function animateBackers(obj, start, end, duration) {
    let startNum = null;
    const step = (Num) => {
      if (!startNum) startNum = Num;
      const progress = Math.min((Num - startNum) / duration, 1);
      obj.innerHTML = `${(Math.floor(progress * (end - start) + start)).toLocaleString('en-US')}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

animateBackers(contributionsCard, 0, indiv_contributions, 5000);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${indiv_contributions.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const total_raised = GAMES_JSON.reduce( (raised, game) => {
    return raised + game.pledged;
}, 0);
// set inner HTML using template literal

function animateRaised(obj, start, end, duration) {
    let startNum = null;
    const step = (Num) => {
      if (!startNum) startNum = Num;
      const progress = Math.min((Num - startNum) / duration, 1);
      obj.innerHTML = `$${(Math.floor(progress * (end - start) + start)).toLocaleString('en-US')}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };
  
animateRaised(raisedCard, 0, total_raised, 5000);
 

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const game_num = GAMES_JSON.reduce( (num, game) => {
    return num + 1;
}, 0);

gamesCard.innerHTML = `${game_num}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter( (game) => {
        return game.goal > game.pledged;
    })

    // use the function we previously created to add the unfunded games to the DOM
    return addGamesToPage(unfundedGames);
};

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged >= game.goal;
    })

    // use the function we previously created to add unfunded games to the DOM
    return addGamesToPage(fundedGames);
    
};

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    return addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("mousedown", filterUnfundedOnly);
fundedBtn.addEventListener("mousedown", filterFundedOnly);
allBtn.addEventListener("mousedown", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedTotal = GAMES_JSON.reduce( (funds, game) => {
    return funds + ((game.pledged < game.goal) ? 1 : 0);
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const unfundedDescription =
    `A total of <b>$${total_raised.toLocaleString('en-US')}</b> has been raised for <b>${(GAMES_JSON.length)}</b> games. Currently, 
     <b>${unfundedTotal}</b> ${(unfundedTotal > 1) ? 'games remain' : 'game remains'}
     unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const unfundedPara = document.createElement("p");
unfundedPara.innerHTML = unfundedDescription;

descriptionContainer.appendChild(unfundedPara);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [top1, top2, ...otherGames] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledged = top1.name;
firstGameContainer.innerHTML += topPledged;
// do the same for the runner up item
let secondPledged = top2.name;
secondGameContainer.innerHTML += secondPledged;

const gameSearch = document.getElementById("search");

gameSearch.addEventListener("input", (e) => {
    let keyword = e.target.value
    deleteChildElements(gamesContainer);
    if (keyword && keyword.trim().length > 0) {
        keyword = keyword.trim().toLowerCase()
        
        let searchGame = GAMES_JSON.filter( (game) => {
            return game.name.toLowerCase().includes(keyword);
        })
        
        if (searchGame.length > 0) {
            return addGamesToPage(searchGame)
        } else {
            gamesContainer.innerHTML = "Please check that you have typed your search term correctly, or that game does not exist yet!"
        };
    } else {
        addGamesToPage(GAMES_JSON);}
});