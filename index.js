/*
 * Name: Nur Ahmed
 * Date: 4/30/2024
 * Section: CSE 154 AD
 *
 * This script powers the Game Deals Finder, helping users find the best deals for games.
 * It enables searching for game deals and dynamically displays results.
 * It also includes functionality for managing tasks.
 */
"use strict";
(function() {
  window.addEventListener("load", init);

  const BASE_URL = "https://www.cheapshark.com/api/1.0/";

  /**
   * Initializes the page by setting up event listeners.
   */
  function init() {
    id("view-list").addEventListener("click", fetchAllDeals);
    id("search-deals").addEventListener("click", () => switchView(id("game-view")));
    qsa(".go-back").forEach(button => {
      button.addEventListener("click", () => switchView(id("introduction")));
    });
    id("fetch-deals").addEventListener("click", () => {
      const gameName = id("game-name-input").value.trim();
      if (gameName) {
        fetchDealsByGameName(gameName);
      } else {
        handleError(new Error("Please enter a game name to search for deals."));
      }
    });
  }

  /**
   * Fetches all deals, not specific to any game.
   */
  function fetchAllDeals() {
    const url = `${BASE_URL}deals?storeID=1&upperPrice=15`;
    fetch(url)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayDeals)
      .catch(handleError);
  }

  /**
   * Fetches deals specific to a game by its name.
   * @param {string} gameName - the name of the game to fetch deals for.
   */
  function fetchDealsByGameName(gameName) {
    const url = `${BASE_URL}deals?title=${encodeURIComponent(gameName)}&upperPrice=50`;
    fetch(url)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayDeals)
      .catch(handleError);
  }

  /**
   * Displays deals in the UI.
   * @param {array} deals - Array of deal objects.
   */
  function displayDeals(deals) {
    const container = id("deals-list-container");
    container.innerHTML = deals.map(deal => `
      <div>
        <h4>${deal.title}</h4>
        <p>Sale Price: $${deal.salePrice} (Normal Price: $${deal.normalPrice})</p>
        <p>Savings: ${parseFloat(deal.savings).toFixed(2)}%</p>
        <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank">View Deal</a>
      </div>
    `).join('');
    switchView(id("list-view"));
  }

  /**
   * Handles errors during fetch operations by dynamically creating and displaying error messages
   * within the application UI, including a back button to navigate to the main view.
   * @param {Error} error - The error that occurred during a fetch operation.
   */
  function handleError(error) {
    const currentView = document.querySelector('.view.active');
    currentView.innerHTML = '';

    const errorText = document.createElement("p");
    errorText.innerText = "An error occurred! Please try again later.";

    const detailedErrorText = document.createElement("p");
    detailedErrorText.innerText = `Error Details: ${error.message}`;

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add("go-back");

    currentView.appendChild(errorText);
    currentView.appendChild(detailedErrorText);
    currentView.appendChild(backButton);

    backButton.addEventListener("click", () => switchView(id("game-view")));

    switchView(id("introduction"));
  }

  /**
   * Verifies the response status and throws an error if it is not OK.
   * @param {Response} response - The fetch response.
   * @returns {Promise<Response>} - The fetch response if status is OK.
   */
  function statusCheck(response) {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response;
  }

  /**
   * Switches the view to the specified section.
   * @param {HTMLElement} viewElement - The element to display.
   */
  function switchView(viewElement) {
    qsa(".view").forEach(section => {
      section.style.display = 'none';
    });
    viewElement.style.display = 'block';
    viewElement.scrollTo(0, 0);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} selector - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();