let mapConfig = {
    minZoom: 4,
    maxZoom: 18,
    zoom: 16,
    zoomControl: false
}

let defaultLat = 51.505;
let defaultLng = -0.09;

let map = L.map('map', mapConfig).setView([defaultLat, defaultLng], 17);
let markerIcon = L.icon({
    iconUrl: 'assets/icon-location.svg'
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const apiKey = 'at_YQAFmWS1mtsgqRYnOCdZRSdVi00e9';

let searchBar = document.querySelector('.search-bar');
let searchButton = document.querySelector('.search-button');
let searchInput = document.querySelector('.search-input');
let infoIpValue = document.querySelector('.ip-address-info');
let infoLocationValue = document.querySelector('.location-info');
let infoTimezoneValue = document.querySelector('.timezone-info');
let infoICPValue = document.querySelector('.isp-info');

let errorPopup = document.querySelector('.error-popup');
let overlay = document.querySelector('.overlay');
let closePopupButton = document.querySelector('.close-popup');

function fillingData(ipData) {
    showMap(ipData.location.lat, ipData.location.lng)
    addTextData(ipData.ip, ipData.location.country, ipData.location.region, ipData.location.postalCode,
        ipData.location.timezone, ipData.isp)
}

function showMap(lat, lng) {
    map.setView([lat, lng], 17);
    L.marker([lat, lng], {icon: markerIcon}).addTo(map);
};

function addTextData(ip, country, region, postalCode, timezone, isp) {
    infoIpValue.innerHTML = ip;
    infoLocationValue.innerHTML = `${country}, ${region} ${postalCode}`;
    infoTimezoneValue.innerHTML = `UTC ${timezone}`;
    infoICPValue.innerHTML = isp;
}

function proccesingIpData (response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json()
            .then((ipData) => {
                fillingData(ipData)
            })
    }
    else {
        searchBar.classList.add('error');
        errorPopup.classList.add('active');
        overlay.classList.add('active');
    }
}

async function findIpAddress (ipAddress, apiKey) {
    await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`)
        .then((response) => proccesingIpData(response))
}

async function findDomenAddress (domenAddress, apiKey) {
    await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${domenAddress}`)
        .then((response) => proccesingIpData(response))
}

searchBar.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', () => {
    if (searchBar.classList.contains('error')) searchBar.classList.remove('error');
})

function handleFormSubmit(event) {
    event.preventDefault()
}

searchButton.addEventListener('click' , async function () {
    let inputData = searchInput.value.trim();
    let reg = new RegExp(/^\d/);
    if (inputData != '') {
        reg.test(inputData) ? await findIpAddress(inputData, apiKey) : await findDomenAddress(inputData, apiKey);
    } else {
        searchBar.classList.add('error');
    }
})

closePopupButton.addEventListener('click', () => {
    errorPopup.classList.remove('active');
    overlay.classList.remove('active');
})


