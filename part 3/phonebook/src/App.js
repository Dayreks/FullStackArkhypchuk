import { useState, useEffect } from 'react'
import AddForm from './AddForm'
import Filter from './Filter'
import List from './List'
import axios from 'axios'

import service from './services/persons'

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

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [showThis, setShowThis] = useState('')
  const [message, setMessage] = useState(null)

  const namesToShow = persons.filter(person => person.name?.toLowerCase().includes(showThis))


  const addPerson = (event) => {
    event.preventDefault();
    

    const findTheName = persons.filter(person => person.name===newName)

    if (findTheName.length!==0) {
      if(window.confirm(`${findTheName[0].name} is already added to the phonebook, replace the old number with the new one?`)){
        const contact = persons.find(el => el.id === findTheName[0].id)
        const updatedContact = { ...contact, number: newPhone }

        service
        .update(findTheName[0].id, updatedContact)
        .then(returnedContact =>{
          setPersons(persons.map(el =>el.id !== findTheName[0].id ? el : returnedContact))})
          .catch(error => {
            setMessage({text:`Information of ${findTheName[0].name} has already been removed from server`, type:'error'})
            setTimeout(() => {setMessage(null)}, 3000)
            setPersons(persons.filter(el => el.id !== findTheName[0].id))
          })
        setNewName("")
        setNewPhone("")
        document.getElementById('nameInput').value = ''
        document.getElementById('phoneInput').value = ''
      }
    }

    else{

      if(newName.length < 3 || newPhone.length < 8) {
        setMessage({text:`Name must be at least 3 characters and number must be at least 8 characters`, type:'validation'})
        console.log('134234567890')
        setTimeout(() => {setMessage(null)}, 3000)
      } 

      
        const newPerson = {
          name: newName,
          number: newPhone,
        }

        service.create(newPerson)
        .then(returnedContacts => {
            setPersons(persons.concat(newPerson))
            setMessage({text:`Added ${newPerson.name}`, type:'success'})
            setTimeout(() => {setMessage(null)}, 3000)
        })
        .catch(error => {
          
         if (error.request.status === 404) {
          console.log(error)
            // const errors = ;
            // const message = Object.values(errors).map(error => error.message).join(', ');
            setMessage({text:`Name must be at least 3 characters and number must be at least 8 characters`, type:'validation'})
            console.log('134234567890')
            setTimeout(() => {setMessage(null)}, 3000)
          } else {
            console.log('hahahhah');
          }
        });
      

      setNewName("")
      setNewPhone("")
      document.getElementById('nameInput').value = ''
      document.getElementById('phoneInput').value = ''
    }

  }


  const changeFilterValue = (e) => {
    e.preventDefault(); 
    setShowThis(e.target.value)
  }

  const changeNameValue = (e) => {
    e.preventDefault(); 
    setNewName(e.target.value)
  }

  const changePhoneValue = (e) => {
    e.preventDefault(); 
    setNewPhone(e.target.value)
  }

  useEffect(() => {
    console.log('effect')
    axios
      .get(`http://localhost:3001/api/persons`)
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])


  const handleDelete = (e) => {
    console.log(e.target.value)
    if(window.confirm(`Delete ${e.target.name}?`)){
      service
      .deleteUser(e.target.value)
      .catch(error => {alert('the contact was not deleted from the server')})

      setPersons(persons.filter(el => el.name !== e.target.name))
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={message} />
        <Filter changeFilterValue={changeFilterValue}/>
        <AddForm changeNameValue={changeNameValue} changePhoneValue={changePhoneValue} addPerson={addPerson}/>
      <h2>Numbers</h2>
        <List key='1' namesToShow={namesToShow} handleDelete={handleDelete}/> 
        {console.log(namesToShow)}
    </div>
  )
}

export default App