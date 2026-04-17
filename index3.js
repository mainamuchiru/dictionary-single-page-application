/**The app aims to be a simple and intuitive tool for search words from an AudioParam, 
getting their meanings, pronunciations,and synonyms. It will also provide audio playback for the pronunciation.**/

const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const resultContainer = document.querySelector('#result');

async function fetchWordData(word) {
    try {
        const response = await fetch(`${baseUrl}${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        return data[0]; // Return the first result
    } catch (error) {
        console.error(error);
        return null;
    }
}

function displayWordData(wordData) {
    const resultContainer = document.getElementById('result'); // Ensure this is defined
    
    if (!wordData) {
        resultContainer.style.display = 'block'; // Show the box to display the error
        resultContainer.innerHTML = '<p>Word not found. Please try another word.</p>';
        return;
    }
    //shows the container only when it has content
    resultContainer.style.display = 'flex';

    // this finds the first phonetic or audio that has text and audio
    const { word, phonetics, meanings } = wordData;
    const phoneticText = phonetics.find((p) => p.text && p.audio) || phonetics[0] ||{};
    const audioUrl = phonetics.find(p => p.audio)?.audio;
    const meaning = meanings[0]?.definitions[0]?.definition || 'N/A';  
    const synonymsList = meanings[0]?.synonyms?.length > 0 ? meanings[0].synonyms : meanings[0]?.definitions[0]?.synonyms ||[];
    const synonyms = synonymsList.length > 0 ? synonymsList.join(', ') : 'N/A';
    const partOfSpeech = meanings[0]?.partOfSpeech || 'N/A';
    const example = meanings[0]?.definitions[0]?.example || 'N/A';

    resultContainer.innerHTML = `
        <div class="word-header">
        <h2>${word}</h2>
        <button id="addFavorite" class="fav-btn">⭐ Favorite</button> </div>
        <p><strong>Meaning:</strong> ${meaning}</p>
        <p><strong>Phonetic:</strong> ${phoneticText.text || 'N/A'}</p>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Synonyms:</strong> ${synonyms}</p>
        <p><strong>Example:</strong> ${example}</p>
    `;
    //this adds an event listener to the add a new favorite button
    document.getElementById('addFavorite').addEventListener('click', () => {
        selectFavouriteWord(word);
    });


    if (audioUrl) {
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioUrl;
        audioElement.style.marginTop = '10px';
        resultContainer.appendChild(audioElement);
    } 
    }

searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const word = searchInput.value.trim();
    resultContainer.style.display = 'none'; // Hide the box initially
    resultContainer.innerHTML = ''; // clear previous results

    if (word) {
        const wordData = await fetchWordData(word);
        displayWordData(wordData);
    }
    searchInput.value = '';
    searchInput.focus();   
}); 
document.addEventListener('DOMContentLoaded', () => {
    const feature = document.querySelector('.feature');
    const searchButton = document.querySelector('#searchButton');
    const content = document.querySelector('.content');

    // 1. Zoom, Blur, and Opacity Logic on Scroll
    const handleScroll = () => {
        const fromTop = window.scrollY;

        // Zoom logic: Starts at 150%, ends at 100%
        let zoomValue = 150 - (fromTop / 10);
        if (zoomValue < 100) zoomValue = 100;

        // Blur and Opacity logic
        const blurValue = fromTop / 20;
        const opacityValue = 1 - (fromTop / 1000);

        if (feature) {
            // Using requestAnimationFrame for better performance
            window.requestAnimationFrame(() => {
                feature.style.backgroundSize = `${zoomValue}%`;
                feature.style.filter = `blur(${blurValue}px)`;
                feature.style.opacity = opacityValue;
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load to set initial state

    // 2. Automatic Smooth Scroll on Button Click
    if (searchButton && content) {
        searchButton.addEventListener('click', (e) => {
            // Your API fetch logic should handle e.preventDefault()
            const targetOffset = content.offsetTop + (window.innerHeight * 0.7); // Scroll to 70% of the content section
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        });
    }
});

//creating a array to store favourite words which can be accessed later.
let favouriteWords = JSON.parse(localStorage.getItem('favouriteWords')) || [];
const selectFavouriteWord = (word) => {
// first avoid dublicating the word
if (!favouriteWords.includes(word)) {
    favouriteWords.push(word);
    localStorage.setItem('favouriteWords', JSON.stringify(favouriteWords));
    console.log(`${word} added to favourites`);
} else {
    console.log(`${word} is already in favourites`);
}
};

const viewFavoritesBtn = document.querySelector('#viewFavorites');
viewFavoritesBtn.addEventListener('click', () => {
    // you click once to see the list then again to hind the list
    //checking wheather the button is open/ has words in it
   const isAlreadyOpen = resultContainer.querySelector('#favHeader');
   
   if (isAlreadyOpen){ // this ensures that all the elements are closed
    resultContainer.innerHTML = '';
    return;
   } //This keeps it open showing the list
    if (favouriteWords.length === 0) {
        resultContainer.innerHTML = '';
        return;
    }
//render the full UI
    resultContainer.innerHTML = `
        <h3 id="favHeader" style="margin-bottom: 10px;">My Favorite Words:</h3>
        <ul class="fav-list">
            ${favouriteWords.map(word => `<li>${word}</li>`).join('')}
        </ul>
        <button id="clearFavs">Clear All</button>
    `;

    // re-attach the clear functionality
    document.getElementById('clearFavs').addEventListener('click', () => {
        favouriteWords = [];
        localStorage.removeItem('favouriteWords');
        resultContainer.innerHTML = ' ';
    });
});