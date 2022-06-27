import '../css/styles.css'
import fetchCountries from './fetchCountries.js'
import Notiflix from 'notiflix'
import debounce from 'lodash.debounce'

const DEBOUNCE_DELAY = 300

const input = document.getElementById('search-box')
const list = document.querySelector('ul.country-list')
const info = document.querySelector('div.country-info')

const cleanMarkup = ref => (ref.innerHTML = '')

const inputHandler = event => {
  const textInput = event.target.value.trim()

  if (!textInput) {
    cleanMarkup(list)
    cleanMarkup(info)
    return
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data)
      if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name')
        cleanMarkup(list)
        cleanMarkup(info)
        return
      }
      renderMarkup(data)
    })
    .catch(err => {
      cleanMarkup(list)
      cleanMarkup(info)
      Notiflix.Notify.failure('Oops, there is no country with that name')
    })
}

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(list)
    const markupInfo = createInfoMarkup(data)
    info.innerHTML = markupInfo
  } else {
    cleanMarkup(info)
    const markupList = createListMarkup(data)
    list.innerHTML = markupList
  }
}

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="160px" height="100px"><span class="country__name">${name.official}</span></li>`,
    )
    .join('')
}

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1 class="country__header"><img src="${flags.png}" alt="${name.official}" width="160px" height="100px"><span class="country__name">${name.official}</span></h1>
      <p class="country__info">Capital: ${capital}</p>
      <p class="country__info">Population: ${population}</p>
      <p class="country__info">Languages: ${Object.values(languages)}</p>`,
  )
}

input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY))