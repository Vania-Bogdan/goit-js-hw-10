const BASE_URL = 'https://restcountries.com/v3.1/name'

function fetchCountries(countryName) {
    return fetch(`${BASE_URL}/${countryName}?fields=name,capital,population,flags,languages`)
        .then(response => {
          if (response.status === 404) {
            return Promise.reject(new Error())
          }
          
          return response.json()
        })
}

export default fetchCountries