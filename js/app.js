
async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()// convert data from api into js object 

  const pokemonArray = data.results


  const pokemonDetails = await Promise.all([
    ...pokemonArray.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
    )
  ]
  )
  //console.log(data);
  allPokemon = pokemonDetails; // pokemonDetails is an array containing pokemon elements
  displayPokemon(allPokemon);
  displayTypeFilters(allPokemon);
  
}

fetchPokemonList();
let allPokemon = [];

// go through pokemonList and creates all pokemon cards elements and appends those to pokemon-container
async function displayPokemon(pokemonList){
  document.getElementById("pokemon-container").innerHTML = "" //clear first!
  pokemonList.forEach(pokemon => {
    const card = document.createElement("div")// creates div html element dynamically
    card.classList.add("pokemon-card")
    // you want to store the pokemonID info to each pokemon card so you can get the info later from outside of this function.
    card.dataset.id = pokemon.id // stores the pokemon's id on the card element
    card.innerHTML = `<img src="${pokemon.sprites.front_default}">
    <p>${pokemon.name}</p>
    <p>${pokemon.id}</p>`

    document.getElementById("pokemon-container").appendChild(card)
  })

  console.log(pokemonList);
}

// a function to search the clicked pokemon card
document.getElementById("pokemon-container").addEventListener("click", (e) => {
  const card = e.target.closest(".pokemon-card") // html element
  if(!card) return
  const id = Number(card.dataset.id)
  const pokemon = allPokemon.find(p => p.id === id)
  openModal(pokemon)
  
})


function openModal(pokemon) {
  // makes the overlay appear
  const overlay = document.getElementById("modal-overlay")// hidden by default
  overlay.classList.remove("hidden")
  
  const types = pokemon.types.map(t => t.type.name) // modify pokemon types array 
  const typeBadges = types.map(type =>
    `<span class="type-badge ${type}">${type}</span>`
  ).join("")

  const statusBadges = pokemon.stats.map(s => 
    `<div class="stat-row">
      <span class="stat-name">${s.stat.name}</span>
      <div class="stat-bar">
        <div class="stat-fill" style="width: ${s.base_stat / 255 * 100}%"></div>
      </div>
      <span class="stat-value">${s.base_stat}</span>
    </div>
  `).join("")

  const content = document.getElementById("modal-content")
  content.innerHTML = `
  <button id="close">x</button>
  <img src="${pokemon.sprites.other["official-artwork"].front_default}">
  <h2 id="modal-name"> ${pokemon.name} </h2>
  <div id="modal-hw">
    <p> ${pokemon.height / 10}m </p>
    <p> ${pokemon.weight / 10}kg </p>
  </div>
  <div id="modal-types"> ${typeBadges} </div>
  <div> ${statusBadges} </div>
  `
  document.getElementById("close").addEventListener("click", closeModal)
  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal()
  })
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay")
  overlay.classList.add("hidden")
}

async function searchPokemon() {
  let value = document.getElementById("search-input").value.toLowerCase();
  const filtered = allPokemon.filter(pokemon =>
    pokemon.name.includes(value)
  )
  displayPokemon(filtered);
}


document.getElementById("search-input").addEventListener("input", searchPokemon);



function displayTypeFilters(allPokemon) {
  // removing duplicates with Set and putting it back to array
  const allTypes = [...new Set(// remove the duplicates
    allPokemon.map(pokemon => pokemon.types.map(t => t.type.name)).flat() // make one layer array
  )]
  allTypes.forEach(type => {
    const button = document.createElement("button") // dynamically create html element
    button.className = `type-badge ${type}` // for CSS
    button.textContent = type
    button.addEventListener("click", () => filterByType(type))
    document.getElementById("type-filters").appendChild(button)
  }
)
}

async function filterByType(type) {
  const filtered = allPokemon.filter(pokemon => 
    pokemon.types.some(t => t.type.name === type)
  )
  displayPokemon(filtered);
}

