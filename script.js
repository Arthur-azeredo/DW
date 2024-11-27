document.addEventListener('DOMContentLoaded', () => {
    const pokemonForm = document.getElementById('pokemon-form');
    const pokemonData = document.getElementById('pokemon-data');
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const pokemonModal = document.getElementById('pokemon-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalPokemonDetails = document.getElementById('modal-pokemon-details');

     // Função que busca os detalhes de um Pokémon pelo nome
    async function fetchPokemonDetails(name) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar detalhes do Pokémon ${name}:`, error);
            return null;
        }
    }

       // Função que busca os Pokémon por região
    async function fetchPokemonByRegion(region) {
        const regionOffsets = {
            'kanto': {offset: 0, limit: 151},
            'johto': {offset: 151, limit: 100},
            'hoenn': {offset: 251, limit: 135},
            'sinnoh': {offset: 386, limit: 107},
            'unova': {offset: 493, limit: 156}
        };

        if (!regionOffsets[region.toLowerCase()]) {
            alert('Região não reconhecida.');
            return [];
        }

        const {offset, limit} = regionOffsets[region.toLowerCase()];
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            return data.results.slice(0, 20).map(p => p.name);
        } catch (error) {
            console.error(`Erro ao buscar Pokémons da região ${region}:`, error);
            return [];
        }
    }

      // Função que busca os Pokémon por geração
    async function fetchPokemonByGeneration(generation) {
        const generationOffsets = {
            'gen1': {offset: 0, limit: 151},
            'gen2': {offset: 151, limit: 100},
            'gen3': {offset: 251, limit: 135},
            'gen4': {offset: 386, limit: 107},
            'gen5': {offset: 493, limit: 156}
        };

        if (!generationOffsets[generation.toLowerCase()]) {
            alert('Geração não reconhecida.');
            return [];
        }

        const {offset, limit} = generationOffsets[generation.toLowerCase()];
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            return data.results.slice(0, 20).map(p => p.name);
        } catch (error) {
            console.error(`Erro ao buscar Pokémons da geração ${generation}:`, error);
            return [];
        }
    }

      // Função que cria um card para exibir informações básicas de um Pokémon
    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
            <div class="pokemon-card-inner">
                <div class="pokemon-card-front">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
                    <h3>${pokemon.name.toUpperCase()}</h3>
                    <p>ID: ${pokemon.id}</p>
                    <p>Tipo: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                </div>
                <div class="pokemon-card-back">
                    <img src="imagens/proxy.jpg" alt="card back">
                    </div>
                </div>
            </div>
        `;
    
        card.addEventListener('click', () => openPokemonModal(pokemon));
        return card;
    }

        // Função que abre o modal com informações detalhadas de um Pokémon
    function openPokemonModal(pokemon) {
        modalPokemonDetails.innerHTML = `
            <div class="pokemon-modal-card">
                <h2>${pokemon.name.toUpperCase()}</h2>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" width="200">
                
                <div class="pokemon-details">
                    <h3>Detalhes Básicos</h3>
                    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Experiência Base:</strong> ${pokemon.base_experience}</p>
                    
                    <h3>Tipos</h3>
                    <p>${pokemon.types.map(t => t.type.name).join(', ')}</p>
                    
                    <h3>Habilidades</h3>
                    <p>${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                    
                    <h3>Estatísticas</h3>
                    ${pokemon.stats.map(stat => `
                        <p><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>
                    `).join('')}
                    
                    <h3>Movimentos</h3>
                    <p>${pokemon.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
                </div>
            </div>
        `;
        pokemonModal.style.display = 'flex';
    }

    modalClose.addEventListener('click', () => {
        pokemonModal.style.display = 'none';
    });

    pokemonModal.addEventListener('click', (event) => {
        if (event.target === pokemonModal) {
            pokemonModal.style.display = 'none';
        }
    });

     // Função que carrega uma galeria de Pokémon baseado em tipos
    async function loadTypeGallery(type) {
        pokemonGallery.innerHTML = '';
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
            const typeData = await response.json();
            const pokemonPromises = typeData.pokemon.slice(0, 20).map(p => 
                fetchPokemonDetails(p.pokemon.name)
            );
            
            const pokemonDetails = await Promise.all(pokemonPromises);
            const validPokemon = pokemonDetails.filter(pokemon => pokemon !== null);

            validPokemon.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonGallery.appendChild(card);
            });

        } catch (error) {
            console.error(`Erro ao buscar Pokémons do tipo ${type}:`, error);
            alert(`Erro ao buscar Pokémons do tipo ${type}. Verifique o nome do tipo.`);
        }
    }

     // Função que carrega uma galeria de Pokémon baseada na região 
    async function loadRegionGallery(region) {
        pokemonGallery.innerHTML = '';

        try {
            const pokemonNames = await fetchPokemonByRegion(region);
            const pokemonPromises = pokemonNames.map(name => fetchPokemonDetails(name));
            const pokemonDetails = await Promise.all(pokemonPromises);

            const validPokemon = pokemonDetails.filter(pokemon => pokemon !== null);

            validPokemon.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonGallery.appendChild(card);
            });

        } catch (error) {
            console.error(`Erro ao carregar Pokémons da região ${region}:`, error);
            alert(`Erro ao buscar Pokémons da região ${region}. Verifique o nome da região.`);
        }
    }

     // Função que carrega uma galeria de Pokémon baseada na geração 
    async function loadGenerationGallery(generation) {
        pokemonGallery.innerHTML = '';

        try {
            const pokemonNames = await fetchPokemonByGeneration(generation);
            const pokemonPromises = pokemonNames.map(name => fetchPokemonDetails(name));
            const pokemonDetails = await Promise.all(pokemonPromises);

            const validPokemon = pokemonDetails.filter(pokemon => pokemon !== null);

            validPokemon.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonGallery.appendChild(card);
            });

        } catch (error) {
            console.error(`Erro ao carregar Pokémons da geração ${generation}:`, error);
            alert(`Erro ao buscar Pokémons da geração ${generation}. Verifique o nome da geração.`);
        }
    }

      // Função que lida com a submissão do formulário de busca
    pokemonForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const pokemonInput = document.getElementById('pokemon-name');
        const input = pokemonInput.value.trim().toLowerCase();

        if (input === 'type') {
            const type = prompt('Digite o tipo de Pokémon (fire, water, grass, electric, etc):');
            if (type) {
                await loadTypeGallery(type);
            }
        } else if (input === 'region') {
            const region = prompt('Digite a região (kanto, johto, hoenn, sinnoh, unova):');
            if (region) {
                await loadRegionGallery(region);
            }
        } else if (input === 'generation') {
            const generation = prompt('Digite a geração (gen1, gen2, gen3, gen4, gen5):');
            if (generation) {
                await loadGenerationGallery(generation);
            }
        } else {
            
            try {
                const pokemon = await fetchPokemonDetails(input);
                if (pokemon) {
                    pokemonGallery.innerHTML = ''; 
                    const card = createPokemonCard(pokemon);
                    pokemonGallery.appendChild(card);
                } else {
                    alert('Pokémon não encontrado');
                }
            } catch (error) {
                console.error('Erro na busca do Pokémon:', error);
                alert('Erro ao buscar Pokémon');
            }
        }

        pokemonInput.value = '';
    });

     // Função que carrega Pokémon iniciais ao abrir o site
    async function loadInitialPokemon() {
        const initialTypes = ['fire', 'water', 'grass', 'electric'];
        const type = initialTypes[Math.floor(Math.random() * initialTypes.length)];
        await loadTypeGallery(type);
    }

    loadInitialPokemon();
});