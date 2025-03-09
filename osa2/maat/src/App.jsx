// TEHTÄVÄ 2.18 TEHTY

import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (value) {
      console.log('searching', value)
      const result = countries.filter((country) => {
        const valueLower = value.toLowerCase()
        const commonLower = country.name.common.toLowerCase()
        const officialLower = country.name.official.toLowerCase()
        return commonLower.includes(valueLower) || officialLower.includes(valueLower)
      })
      setFiltered(result)
    } else {
      setFiltered([])
    }
  }, [value, countries])


  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
        find counties: <input value={value} onChange={handleChange} />
      {filtered.length > 10 &&
        <p>Too many matches, specify another filter</p>
      }
      {filtered.length <=10 && filtered.length > 1 &&
        <ul>
          {filtered.map((country) => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      }
      {filtered.length === 1 &&
        <div>
          <h1>{filtered[0].name.common}</h1>
          <p>Capital {filtered[0].capital}</p>
          <p>Area {filtered[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(filtered[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={filtered[0].flags.png}
            alt={filtered[0].flags.alt}
          />
        </div>
      }
    </div>
  )
}

export default App