import { useState, useEffect } from 'react'
import AddForm from './AddForm'
import Filter from './Filter'
import List from './List'
import axios from 'axios'

import service from './services/persons'
import './Notification.css'

const Notification = ({ message }) => {
  console.log('I am here')
    if (message === null) {
      return null
    }
    else {
      if (message.type === 'success'){
        return (
          <div className="success">
            {message.text}
          </div>
        )
      }
      if (message.type === 'validation'){
        return (
          <div className="error">
            {message.text}
          </div>
        )
      }
      else {
        return (
          <div className='error'>
            {message.text}
          </div>
        )
      }
    }
}

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)
  const newName = useField('text')
  const newPhone = useField('tel')
  const showThis = useField('text')

  const namesToShow = persons.filter(person => person.name?.toLowerCase().includes(showThis.value))

  useEffect(() => {
    axios.get(`http://localhost:3001/api/persons`)
      .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName.value)

    if (existingPerson) {
      updatePerson(existingPerson)
    } else {
      if(newName.value.length < 3 || newPhone.value.length < 8) {
        setMessage({text:`Name must be at least 3 characters and number must be at least 8 characters`, type:'validation'})
        setTimeout(() => {setMessage(null)}, 3000)
      } else {
        createPerson()
      }
    }

    newName.onChange({ target: { value: '' } })
    newPhone.onChange({ target: { value: '' } })
  }

  const updatePerson = (person) => {
    if (window.confirm(`${person.name} is already added to the phonebook, replace the old number with the new one?`)) {
      const updatedPerson = { ...person, number: newPhone.value }

      service.update(person.id, updatedPerson)
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          setMessage({ text: `Updated ${updatedPerson.name}`, type: 'success' })
        })
        .catch(error => {
          setMessage({text:`Information of ${person.name} has already been removed from server`, type:'error'})
          setTimeout(() => {setMessage(null)}, 3000)
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const createPerson = () => {
    const newPerson = {
      name: newName.value,
      number: newPhone.value,
    }

    service.create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setMessage({ text: `Added ${createdPerson.name}`, type: 'success' })
      })
      .catch(error => {
        if (error.request.status === 404) {
          setMessage({text:`Name must be at least 3 characters and number must be at least 8 characters`, type:'validation'})
          setTimeout(() => {setMessage(null)}, 3000)
        } 
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      service.deleteUser(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage({ text: `Deleted ${name}`, type: 'success' })
        })
        .catch(error => {
          setMessage({text:`Information of ${name} was not removed from server`, type:'error'})
          setTimeout(() => {setMessage(null)}, 3000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter showThis={showThis} />
      <AddForm addPerson={addPerson} newName={newName} newPhone={newPhone} />
      <h2>Numbers</h2>
      <List namesToShow={namesToShow} handleDelete={handleDelete}/> 
    </div>
  )
}

export default App
