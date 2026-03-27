const API_KEY = 'kspt0prS0SQDZODgttoWnvtNjoPDxEJuSmL29hPo';
const IMAGE_ID_STARTER = 'gallery-item';
const TEST_IMAGE_URL = '../img/NASA-Logo-Large.jpg';
const VIDEO_SAMPLE = {
    "date": "2026-03-24",
    "explanation": "Is gravity the same over the surface of the Earth?  No -- in some places you will feel slightly heavier than others.  The featured Earth map video shows in colors and exaggerated highs and lows where the gravitational field of Earth is relatively strong and weak.  A low spot, where you would feel slightly lighter, can be seen just off the coast of India, in blue, while a relative high occurs in the mountains of Chile in South America.  The cause of these irregularities does not always follow present surface features. Scientists hypothesize that other important factors lie in deep underground structures in Earth's mantle and may be related to the Earth's appearance in the distant past.  The featured map was composed from data taken by NASA's twin GRACE satellites that orbited the Earth from 2002 to 2017.  GRACE mapped Earth's gravity by carefully tracking tiny changes in the distance between the two satellites.",
    "media_type": "video",
    "service_version": "v1",
    "title": "A Gravity Map of Earth",
    "url": "https://apod.nasa.gov/apod/image/2603/GravityEarth_GRACE_silent.mp4"
};

let galleryItems = 0;
let placeholderExists = true;

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

/*-----------------------= My code =------------------------------*/

//TODO: fetchDataAcross function; fetch based on date range
//TODO: displayImages function
    //TODO: addImage(url) function
//TODO: add initialize function



async function fetchData() {
    const startDate = startInput.value;
    const endDate = endInput.value;

    const url = `
        https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}}&end_date=${endDate}}
    `;
    
    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error(`Error code: ${response.status}`);
        }

        const data = await response.json();

        if(data.response == true) {

        }
    } catch(error) {

    }
    
}

function clearPlaceholder() {
    if(placeholderExists) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = "";
        placeholderExists = false;
    }
}

function addImage(url, title, date, explanation) {
    gallery.innerHTML += `
        <div class="gallery-item" id="${IMAGE_ID_STARTER}${galleryItems}">
            <img src=${url} alt="image ${galleryItems}">
        </div>
    `;
    galleryItems++;
}

function addVideo(url, title, date, explanation) {

}

// Assumes dataObj includes fields for "url", "title", "date", "explanation", and "media_type"
function addItemByObject(dataObj) {

}

function displayImages(galleryData) {
    clearPlaceholder();
    //for(let i = 0; i < (length of JSON elements); i++) {
        // TODO: find length of the fetched JSON
        // TODO: addImage() function
    //}
}

// test addImage function
function initializeEvents() {
    const getImagesButton = document.getElementById('get-images-button');
    getImagesButton.addEventListener('click', function() {
        clearPlaceholder();
        addImage(TEST_IMAGE_URL);
    });
}

initializeEvents();