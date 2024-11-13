// script.js

document.getElementById('pokemon-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('pokemon-name').value.toLowerCase();
    const pokemonData = await fetchPokemonData(name);
    
    if (pokemonData) {
        displayPokemonData(pokemonData);
    } else {
        document.getElementById('pokemon-data').innerHTML = '<p>Pokémon não encontrado!</p>';
    }
});

// Função para buscar dados do Pokémon
async function fetchPokemonData(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return null;
}

// Função para exibir os dados do Pokémon
function displayPokemonData(data) {
    const pokemonDataSection = document.getElementById('pokemon-data');
    pokemonDataSection.innerHTML = `
        <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Altura: ${data.height} dm</p>
        <p>Peso: ${data.weight} hg</p>
        <p>Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p>Tipos: ${data.types.map(type => type.type.name).join(', ')}</p>
        <p>Experiência Base: ${data.base_experience}</p>
        <div class="stats">
            ${data.stats.map(stat => `
                <p>${stat.stat.name}: ${stat.base_stat}</p>
            `).join('')}
        </div>
    `;
}

async function fetchPokemonByType(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    return data.pokemon.slice(0, 10); // Retorna os primeiros 10 Pokémon do tipo
}

function displayPokemonGallery(pokemonList) {
    const gallery = document.getElementById('pokemon-data');
    gallery.innerHTML = pokemonList.map(pokemon => `
        <div class="pokemon-card" onmouseover="flipCard(this)" onmouseout="unflipCard(this)">
            <div class="card-front">
                <img src="${pokemon.pokemon.sprites.front_default}" alt="${pokemon.pokemon.name}">
                <h3>${pokemon.pokemon.name}</h3>
            </div>
            <div class="card-back">
                <img src="imagens/${pokemon.pokemon.name}.png" alt="${pokemon.pokemon.name}">
            </div>
        </div>
    `).join('');
}

function openModal(pokemon) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Altura: ${pokemon.height} dm</p>
            <p>Peso: ${pokemon.weight} hg</p>
            <p>Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p>Experiência Base: ${pokemon.base_experience}</p>
            <button onclick="closeModal()">Fechar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    document.querySelector('.modal').remove();
}

async function fetchPokemonByRegion(region) {
    const response = await fetch(`https://pokeapi.co/api/v2/region/${region}`);
    const data = await response.json();
    
    // A propriedade 'locations' fornece as áreas onde os Pokémon dessa região podem ser encontrados
    // Usaremos essas áreas para coletar Pokémon dessa região.
    const locations = data.locations;
    const pokemonPromises = [];

    // Para cada local na região, buscamos os Pokémon
    locations.forEach(location => {
        location.areas.forEach(area => {
            pokemonPromises.push(fetch(area.url).then(res => res.json()));
        });
    });

    // Esperamos todas as requisições de Pokémon da região
    const pokemonData = await Promise.all(pokemonPromises);
    
    // Extraímos os Pokémon de cada área
    const pokemonList = pokemonData.flat().map(entry => entry.pokemon);
    return pokemonList;
}

// Função para exibir Pokémon por região na tela
function displayRegionPokemon(pokemonList) {
    const gallery = document.getElementById('pokemon-data');
    gallery.innerHTML = pokemonList.map(pokemon => `
        <div class="pokemon-card" onmouseover="flipCard(this)" onmouseout="unflipCard(this)">
            <div class="card-front">
                <img src="${pokemon.pokemon.sprites.front_default}" alt="${pokemon.pokemon.name}">
                <h3>${pokemon.pokemon.name}</h3>
            </div>
            <div class="card-back">
                <img src="imagens/${pokemon.pokemon.name}.png" alt="${pokemon.pokemon.name}">
            </div>
        </div>
    `).join('');
}

// Função para abrir a modal com as informações do Pokémon
async function openModal(pokemonName) {
    const pokemon = await fetchPokemonData(pokemonName);
    
    if (pokemon) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>Altura: ${pokemon.height} dm</p>
                <p>Peso: ${pokemon.weight} hg</p>
                <p>Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p>Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p>Experiência Base: ${pokemon.base_experience}</p>
                <div class="stats">
                    ${pokemon.stats.map(stat => `
                        <p>${stat.stat.name}: ${stat.base_stat}</p>
                    `).join('')}
                </div>
                <button onclick="closeModal()">Fechar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Função para fechar a modal
function closeModal() {
    document.querySelector('.modal').remove();
}

async function fetchPokemonByAbility(ability) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
    const data = await response.json();
    return data.pokemon; // Retorna os Pokémon que possuem essa habilidade
}

function displayAbilityPokemon(pokemonList) {
    const gallery = document.getElementById('pokemon-data');
    gallery.innerHTML = pokemonList.map(pokemon => `
        <div class="pokemon-card" onmouseover="flipCard(this)" onmouseout="unflipCard(this)">
            <div class="card-front">
                <img src="${pokemon.pokemon.sprites.front_default}" alt="${pokemon.pokemon.name}">
                <h3>${pokemon.pokemon.name}</h3>
            </div>
            <div class="card-back">
                <img src="imagens/${pokemon.pokemon.name}.png" alt="${pokemon.pokemon.name}">
            </div>
        </div>
    `).join('');
}
