import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(null)

  useEffect(() => {
    if (name === '') {
      return
    }

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry(response.data)
        setFound(true)
      })
      .catch(error => {
        setCountry(null)
        setFound(false)
      })
  }, [name])

  return { country, found }
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  const data = country.country

  return (
    <div>
      <h3>{data.name.common} </h3>
      <div>capital {data.capital[0]} </div>
      <div>population {data.population}</div> 
      <img src={data.flags.png} height='100' alt={data.flags.alt}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      {name !== '' && 
      <Country country={country} />
      }
    </div>
  )
}

export default App