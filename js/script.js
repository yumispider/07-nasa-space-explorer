const API_KEY = 'kspt0prS0SQDZODgttoWnvtNjoPDxEJuSmL29hPo';
const IMAGE_ID_STARTER = 'gallery-item';
const TEST_IMAGE_URL = '../img/NASA-Logo-Large.jpg';
const VIDEO_SAMPLE = [{
    "date": "2026-03-24",
    "explanation": "Is gravity the same over the surface of the Earth?  No -- in some places you will feel slightly heavier than others.  The featured Earth map video shows in colors and exaggerated highs and lows where the gravitational field of Earth is relatively strong and weak.  A low spot, where you would feel slightly lighter, can be seen just off the coast of India, in blue, while a relative high occurs in the mountains of Chile in South America.  The cause of these irregularities does not always follow present surface features. Scientists hypothesize that other important factors lie in deep underground structures in Earth's mantle and may be related to the Earth's appearance in the distant past.  The featured map was composed from data taken by NASA's twin GRACE satellites that orbited the Earth from 2002 to 2017.  GRACE mapped Earth's gravity by carefully tracking tiny changes in the distance between the two satellites.",
    "media_type": "video",
    "service_version": "v1",
    "title": "A Gravity Map of Earth",
    "url": "https://apod.nasa.gov/apod/image/2603/GravityEarth_GRACE_silent.mp4"
}];

const IMAGE_SAMPLE = [{
    "copyright": "T. Rector",
    "date": "2017-07-08",
    "explanation": "Similar in size to large, bright spiral galaxies in our neighborhood, IC 342 is a mere 10 million light-years distant in the long-necked, northern constellation Camelopardalis. A sprawling island universe, IC 342 would otherwise be a prominent galaxy in our night sky, but it is hidden from clear view and only glimpsed through the veil of stars, gas and dust clouds along the plane of our own Milky Way galaxy. Even though IC 342's light is dimmed by intervening cosmic clouds, this sharp telescopic image traces the galaxy's own obscuring dust, blue star clusters, and glowing pink star forming regions along spiral arms that wind far from the galaxy's core. IC 342 may have undergone a recent burst of star formation activity and is close enough to have gravitationally influenced the evolution of the local group of galaxies and the Milky Way.",
    "hdurl": "https://apod.nasa.gov/apod/image/1707/ic342_rector2048.jpg",
    "media_type": "image",
    "service_version": "v1",
    "title": "Hidden Galaxy IC 342",
    "url": "https://apod.nasa.gov/apod/image/1707/ic342_rector1024s.jpg"
}];

const MONTH_MAP = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
};

const ERROR_MESSAGE = 'Sorry, we could not retrieve media from the requested dates. Please try again later.'

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

function displayErrorMessage(error) {
    const gallery = document.getElementById('gallery');

    gallery.innerHTML = `
        <p class="gallery-item" id="error-message">
            ${ERROR_MESSAGE}
        </p>
    `;
}

function displayLoadingMessage() {
    const gallery = document.getElementById('gallery');

    gallery.innerHTML = `
        <p class="gallery-item" id="loading-message">
            Loading pictures...
        </p>
    `;
}

async function fetchGalleryItems() {
    clearGallery();
    displayLoadingMessage();

    const startDate = startInput.value;
    const endDate = endInput.value;

    const url = `
        https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}
    `;

    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error(`Error code: ${response.status}`);
        }

        const data = await response.json();

        clearGallery();
        displayGalleryItems(data);
    } catch(error) {
        console.error(`${error}\nCould not fetch images`);
        displayErrorMessage(error);
    }
}

function clearGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = "";
    placeholderExists = false;
}

function getAttr(url, mediaType) {
    let itemAttr;

    switch(mediaType) {
        case 'image':
            itemAttr = `<img src="${url}" alt="image ${galleryItems}"></img>`;
            break;
        case 'video':
            itemAttr = `
                <video class="gallery-item" controls>
                    <source src="${url}" type="video/mp4">
                </video>
            `;
    }

    return itemAttr;
}

function appendGalleryItem(url, title, date, explanation, mediaType) {
    const attr = getAttr(url, mediaType);
    gallery.innerHTML += `
        <div class="gallery-item" id="${IMAGE_ID_STARTER}${galleryItems}">
            ${attr}
            <h2 class="gallery-item-title">
                ${title}
            </h2>
            <p class="gallery-item-date">
                ${date}
            </p>
        </div>
    `;
    galleryItems++;
}

// Clear a leading zero from the day
function cleanDay(dayDate) {
    let cleanDay = dayDate;
    if(dayDate[0] === '0') {
        cleanDay = dayDate.substring(1);
    }
    return cleanDay;
}

// The helper methods for obtaining the year, month, and day of a given date makes the
// assumption that the date parameter comes from an object fetched from the API
function getDay(date) {
    const monthIndex = date.indexOf('-') + 1;
    const dateWithoutYear = date.substring(monthIndex);
    const dayIndex = dateWithoutYear.indexOf('-') + 1;
    const dateWithoutMonth = dateWithoutYear.substring(dayIndex);
    const dayToStr = cleanDay(dateWithoutMonth);

    return dayToStr;
}

function getMonth(date) {
    const monthIndex = date.indexOf('-') + 1;
    const month = date.substring(monthIndex, monthIndex + 2);
    const monthToStr = MONTH_MAP[month];
    return monthToStr;
}

function getYear(date) {
    const endYearIndex = date.indexOf('-');
    const yearToStr = date.substring(0, endYearIndex);
    return yearToStr;
}

function convertDate(date) {
    const day = getDay(date);
    const month = getMonth(date);
    const year = getYear(date);
    
    return `${month} ${day}, ${year}`;
}

// Assumes dataObj includes fields for "url", "title", "date", "explanation", and "media_type"
function addItemByObject(dataObj) {
    const url = dataObj.url;
    const title = dataObj.title;
    let date = dataObj.date;
    date = convertDate(date);
    const explanation = dataObj.explanation;
    const mediaType = dataObj.media_type;

    appendGalleryItem(url, title, date, explanation, mediaType);
}

function displayGalleryItems(galleryData) {
    for(let i = 0; i < (galleryData.length); i++) {
        const currentItem = galleryData[i];
        addItemByObject(currentItem);
    }
}

// test addImage function
function initializeEvents() {
    const getImagesButton = document.getElementById('get-images-button');
    getImagesButton.addEventListener('click', function() {
        //fetchGalleryItems();
        clearGallery();
        displayGalleryItems(IMAGE_SAMPLE);
    });
}

initializeEvents();