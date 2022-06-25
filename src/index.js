import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries, fetchNeighbours } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

//additional, for show info from list
const currentData = {
  array: undefined,
};

//for teg input
function throtleSendData() {
  return debounce(promiseCreator, DEBOUNCE_DELAY);
}

//there are 2 variants
//1)default: search countries by part of name
//2)additional: search all nearby neighbours
function promiseCreator(type, allNeighbours) {
  const { value } = refs.input;
  const partName = value.trim();

  const thePromise =
    type === 'neighbours' ? fetchNeighbours(allNeighbours) : fetchCountries(partName);

  thePromise
    .then(response => showList(response))
    .catch(error => {
      clearList();
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name ');
      } else {
        Notify.failure(error + ', ' + error.message);
      }
    });
}

function clearList() {
  refs.list.innerHTML = '';
}

//render catched data
function showList(countrysArray) {
  stopShowFocus();

  currentData.array = countrysArray;
  let li;
  if (countrysArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countrysArray.length > 1) {
    li = createPlural(countrysArray);
  } else {
    const country = countrysArray[0];
    li = createOne(country);
  }
  refs.list.innerHTML = li;

  //add eventlisnter for buttom(if necessary)
//   buttomForNeighbours();
}

// render list
function createPlural(countrysArray) {
  return countrysArray
    .map((country, index) => {
      const string = `
                <li class="list" data-countryindex = "${index}">
                <div class="img_wrapper">
                    <img src="${country.flags[0]}" alt="flag" class="flag">
                    </div>
                    <span>${country.name.official}</span>
                </li>
            `;
      return string;
    })
    .join('');
}

//render info about one country
function createOne(country, index = 0) {
  const stringLanguages = Object.values(country.languages).join(', ');
  return `
        
        <div class="short_info" data-countryindex="${index}">
            <div class="img_wrapper">
                <img src="${country.flags[0]}" alt="flag" class="flag">
            </div>
            <h3>${country.name.official}</h3>
            </div>
            <div>
                <span class="title">Capital: </span>
                <span>${country.capital.join(', ')}</span>
            <div>
                <span class="title">Population: </span>
                <span>${country.population}</span>
            </div>
            <div>
                <span class="title">Languages: </span>
                <span>${stringLanguages}</span>
            </div>
    `;
}

refs.list.addEventListener('mouseover', showFocus);
refs.input.addEventListener('input', throtleSendData());

//render one from list country
function showFocus() {
  if (event.target.nodeName === 'LI') {
    const index = event.target.dataset.countryindex;
    const country = currentData.array[index];

    const el = createOne(country, index);
    refs.info.innerHTML = el;
    buttomForNeighbours();
  }
}

//stop render country
function stopShowFocus() {
  refs.info.innerHTML = '';
}
