const request = require("request");
const jsdom = require("jsdom");
const fs = require('fs')

const { JSDOM } = jsdom;

function obterConteudo() {
    const url = "https://pokemondb.net/pokedex/all";

    request(url, function (error, response, body) {
        if (error) {
            console.log(error);
            return
        }

        //PEGANDO O BODY
        const dom = new JSDOM(body);

        //ARRAY
        const pokemonsRetorno = [];

        // PEGANDO O ELEMENTO DO STIE
        const pokemons = dom.window.document.querySelectorAll('#pokedex > tbody > tr');

        // TRATATIVA PARA TRANSFORMAR EM JSON
        for (const pokemon of pokemons) {
            const pokemonRetorno = {

            }

            let queryPokedex = pokemon.querySelector('.infocard-cell-data');

            if (queryPokedex)
                pokemonRetorno.pokeDex = queryPokedex.textContent;

            let evolutionName = pokemon.querySelector('.text-muted');

            if(evolutionName)
                pokemonRetorno.evolutionName = evolutionName.textContent;

            let queryName = pokemon.querySelector('.ent-name');
            if (queryName)
                pokemonRetorno.name = queryName.textContent;
                
            let queryType = pokemon.querySelectorAll('.type-icon');
            if (queryType) {
                for (const type of queryType) {
                    pokemonRetorno.types = [];
                    pokemonRetorno.types.push(type.textContent);
                }
            }

            let queryTotal = pokemon.querySelector('.cell-total');

            if (queryTotal);
                pokemonRetorno.total = queryTotal.textContent;

            let queryNums = pokemon.querySelectorAll('.cell-num');

            if(queryNums) {
                pokemonRetorno.hp = queryNums[1].textContent;
                pokemonRetorno.attack = queryNums[2].textContent;
                pokemonRetorno.defese = queryNums[3].textContent;
                pokemonRetorno.spAtk = queryNums[4].textContent;
                pokemonRetorno.spDef = queryNums[5].textContent;
                pokemonRetorno.speed = queryNums[6].textContent;
            }
            
            pokemonsRetorno.push(pokemonRetorno);
        }


        //ESCREVE OS POKEMONS PARA JSON
        fs.writeFileSync("./pokemons.json", JSON.stringify(pokemonsRetorno, null, 2));

        console.log("Concluido")

    })
}

obterConteudo();