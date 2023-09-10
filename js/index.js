let page = 1;
let characterHTML = '';
let lastCharacter;
let clearInfo;
let allInfo = [];

const btnClear = document.getElementById('clear');
const searchBar = document.getElementById('searchCharacter');
const btnSeeMore = document.getElementById('seeMore');

const alive = document.getElementById('alive');
const dead = document.getElementById('dead');
const female = document.getElementById('female');
const male = document.getElementById('male');
// Creo una instancia de IntersectionObserver
let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            page++;
            getData();
        }
    });
}, {
    rootMargin: '0px 0px 200px 0px',
    threshold: 1.0
});

function showCharacters(characters) {
    for (const character of characters) {
        characterHTML += `
        <div class="col-12 col-md-4 col-lg-3 p-3 ">   
            <div class="card div-card">
                <img class="card-img-top img-fluid h-25" src="${character.image}">
                <div class="card-body text-white">
                  <h4 class="card-title text-shadow-black">${character.name}</h4>
                  <span class="card-text d-block text-shadow-black">${character.status}</span>
                  <span class="card-text d-block text-shadow-black">${character.species}</span>
                  <span class="card-text d-block text-shadow-black">${character.gender}</span>
                </div>
                <div class="card-footer">
                  <small class="text-white text-shadow-black">${character.location.name}</small>
                </div>
            </div>
        </div>
        `;
    }
    
    document.getElementById('container').innerHTML = characterHTML;
}

function clear(characters) {
    const radioBtn = document.querySelectorAll('input[type="radio"]');
    radioBtn.forEach(btn => btn.checked = false);
    characterHTML = '';
    searchBar.value='';
    showCharacters(characters);

    if (lastCharacter) {
        observer.unobserve(lastCharacter);
    }
    const charactersInViewport = document.querySelectorAll('#container .card');
    lastCharacter = charactersInViewport[charactersInViewport.length - 1];
    observer.observe(lastCharacter);
}

function filter(characters) {
    const searchText = searchBar.value.toLowerCase().trim();
    const isAlive = alive.checked;
    const isDead = dead.checked;
    const isFemale = female.checked;
    const isMale = male.checked;
  
    const filteredCharacters = characters.filter(character => {
        const nameMatches = character.name.toLowerCase().includes(searchText);
        const statusMatches = !isAlive && !isDead || (isAlive && character.status === 'Alive') || (isDead && character.status === 'Dead');
        const genderMatches = !isFemale && !isMale || (isFemale && character.gender === 'Female') || (isMale && character.gender === 'Male');
        return nameMatches && statusMatches && genderMatches;
    });
    characterHTML = '';
    showCharacters(filteredCharacters);
}

async function getData() {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();
        let arrInfo = data.results;
        
        if (page<=1) {
            clearInfo = arrInfo;
        }
        
        allInfo.push(...arrInfo);
        console.log(allInfo);
        
        showCharacters(arrInfo);
        
        btnClear.addEventListener('click', () => clear(clearInfo));
        searchBar.addEventListener("input", () => filter(allInfo));
        alive.addEventListener('click', () => filter(allInfo));
        dead.addEventListener('click', () => filter(allInfo));
        female.addEventListener('click', () => filter(allInfo));
        male.addEventListener('click', () => filter(allInfo));
        
        if(page <= 43){
            if(lastCharacter){
                observer.unobserve(lastCharacter);
            }
            const charactersInViewport = document.querySelectorAll('#container .card');
            lastCharacter = charactersInViewport[charactersInViewport.length - 1];
            observer.observe(lastCharacter);
        }
    
    } catch (error) {
        console.log('Error', error);
    }
}
getData();
