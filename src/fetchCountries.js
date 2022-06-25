export function fetchCountries(name) {
  return fetch('https://restcountries.com/v3/name/' + name).then(response => {
    // console.log(response);
      if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

export function fetchNeighbours(names) {
  return fetch('https://restcountries.com/v3/alpha?codes=' + names).then(response => {
    // console.log(response);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}