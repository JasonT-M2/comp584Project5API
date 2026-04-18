import { animate, stagger } from "https://cdn.jsdelivr.net/npm/animejs/+esm";

let allCharacters = [];

// Load ALL characters from the API and store it into allCharacters array
//use a for loop to constantly store the chracters pages
async function loadCharacters() {
  let results = [];

  for (let i = 1; i <= 5; i++) {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?page=${i}`,
    );
    const data = await res.json();
    results = results.concat(data.results);
  }

  allCharacters = results;
}

loadCharacters();

// Spin button
document.getElementById("spinBtn").addEventListener("click", () => {
  animateTitle(); // text animation
  spinWheel(); // wheel logic
});

//Animating the wheel
//Randomize the amount and degrees of the spin
//using anime.js we target the wheel and set the amount of rotations
//with a duration of 5 seconds and an easing factor to slow down the wheel close to completion
//then by adding the complete function once the animation finishes then we run our pick Character
function spinWheel() {
  const wheel = document.getElementById("wheel");

  const spins = Math.floor(Math.random() * 8) + 6;
  const finalDeg = spins * 360 + Math.random() * 360;

  anime({
    targets: wheel,
    rotate: finalDeg,
    duration: 5000,
    easing: "cubicBezier(.08,.82,.17,1)",
    complete: () => {
      setTimeout(() => {
        pickRandomCharacter();
      }, 800);
    },
  });
}

// PURE random character selection
//Math.random a random character inside the entire API
function pickRandomCharacter() {
  if (allCharacters.length === 0) return;

  const char = allCharacters[Math.floor(Math.random() * allCharacters.length)];

  showCharacter(char);
}

// Show character + episode details
//Once a character is chosen from pickRandomCharacter then it creates a card
//also extracts the character details of what episodes they appear from by fetching the character.episode
function showCharacter(character) {
  Promise.all(
    character.episode.map((url) => fetch(url).then((r) => r.json())),
  ).then((episodes) => {
    createCard(character, episodes);
  });
}

//creates the cards in which the text will displayed
//first create an episode list from the character information we found after our wheel spin
//then by using DOM element we create an innerHTML card that fades in with character img and info
function createCard(character, episodes = []) {
  const episodeList = episodes
    .map((ep) => `<li>${ep.episode} - ${ep.name}</li>`)
    .join("");

  document.getElementById("result").innerHTML = `
    <div class="result-container fade-in">
      <div class="card character-card">
        <img src="${character.image}" alt="${character.name}" />
        <div class="name">${character.name}</div>
      </div>

      <div class="card episode-card">
        <h3>Episodes (${episodes.length})</h3>
        <ul>${episodeList}</ul>
      </div>
    </div>
  `;
}

//This animateTitle function is to add a bit of extra flair into the website design
//By using anime.js animate functions we change the y axis to make it seem like the words are jumping
//First by taking the id of the title and disecting per charater and then animating per character
//by using the delay function we allow the animation to go in a wave motion
function animateTitle() {
  const title = document.querySelector("#title");

  const text = title.textContent;

  title.innerHTML = [...text]
    .map((char) => `<span class="char">${char}</span>`)
    .join("");

  const chars = title.querySelectorAll(".char");

  animate(chars, {
    y: [
      { to: -25, ease: "outExpo", duration: 400 },
      { to: 0, ease: "outBounce", duration: 700 },
    ],
    rotate: {
      from: "-1turn",
      to: "0turn",
    },
    delay: stagger(40),
  });
}
animate(document.body, {
  scale: 1.1,
  duration: 500,
});
