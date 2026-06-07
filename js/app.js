
async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()// convert data from api into js objet 

  const pokemonArray = data.results


  const pokemonDetails = await Promise.all([
    ...pokemonArray.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
    )
  ]
  )
  console.log(data);
  allPokemon = pokemonDetails; // pokemonDetails is an array containing pokemon elements
  displayPokemon(allPokemon);

}

fetchPokemonList();
let allPokemon = [];

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
  const overlay = document.getElementById("modal-overlay")
  overlay.classList.remove("hidden")
  
  const types = pokemon.types.map(t => t.type.name) // modify pokemon types array 
  const typeBadges = types.map(type =>
    `<span class="type-badge ${type}">${type}</span>`
  ).join(" ")

  const statusBadges = pokemon.stats.map(s => 
    `<p>${s.stat.name}: ${s.base_stat}</p>`
  ).join("")

  const content = document.getElementById("modal-content")
  content.innerHTML = `
  <button id="close">close</button>
  <img src="${pokemon.sprites.front_default}">
  <p> ${pokemon.name} </p>
  <p> ${pokemon.height} </p>
  <p> ${pokemon.weight} </p>
  <div> ${typeBadges} </div>
  <div> ${statusBadges} </div>
  `
}

async function searchPokemon() {
  let value = document.getElementById("search-input").value.toLowerCase();
  const filtered = allPokemon.filter(pokemon =>
    pokemon.name.includes(value)
  )
  displayPokemon(filtered);
}

document.getElementById("search-input").addEventListener("input", searchPokemon);

