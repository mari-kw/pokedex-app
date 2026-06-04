
async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()// convert the raw response into usable js data

  const pokemonArray = data.results

  const pokemonDetails = await Promise.all(
    pokemonArray.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
    )
  )
  
  pokemonDetails.forEach(pokemon => {
    const card = document.createElement("div")// creates div html element dynamically
    card.classList.add("pokemon-card")
    card.innerHTML = `<img src="${pokemon.sprites.front_default}">
    <p>${pokemon.name}</p>
    <p>${pokemon.id}</p>`

    document.getElementById("pokemon-container").appendChild(card)
  })

}

fetchPokemonList();