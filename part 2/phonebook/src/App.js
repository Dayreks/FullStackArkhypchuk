import React, { useState, useEffect } from 'react'
import Contacts from './components/Contacts'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import service from './services/persons'

const Notification = ({ message }) => {
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
  const [ persons, setPersons ] = useState([])
  const [ newContact, setNewContact ] = useState({name: '', number: ''})
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ message, setMessage ] = useState(null)

  useEffect(() => {
    service.getAll().then(initialContacts => {
      setPersons(initialContacts)
    })
  }, [])

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleContactChange = (event) => {
    setNewContact({
      ...newContact,
      [event.target.name]: event.target.value,
    })
  }

  // event handler for form
  const addContact = (event) => {
    event.preventDefault();
  
    const checker = persons.filter((person) => person.name === newContact.name);
  
    if (newContact.name) {
      if (checker.length !== 0) {
        if (!newContact.number || newContact.number === checker[0].number) {
          setMessage({ text: `${newContact.name} is already added to phonebook`, type: 'error' });
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        } else {
          // updating contacts
          if (
            window.confirm(
              `${checker[0].name} is already added to the phonebook, replace the old number with the new one?`
            )
          ) {
            const contact = persons.find((el) => el.id === checker[0].id);
            const changedContact = { ...contact, number: newContact.number };
  
            service
              .updateContact(checker[0].id, changedContact)
              .then((returnedContact) => {
                setPersons(
                  persons.map((el) =>
                    el.id !== checker[0].id ? el : returnedContact
                  )
                );
              })
              .catch((error) => {
                setMessage({
                  text: `Information of ${checker[0].name} has already been removed from server`,
                  type: 'error',
                });
                setTimeout(() => {
                  setMessage(null);
                }, 3000);
                setPersons(persons.filter((el) => el.id !== checker[0].id));
              });
  
            setNewContact({name: '', number: ''});
          }
        }
      } else {
        const contactObj = {
          name: newContact.name,
          number: newContact.number,
        };
  
        service
          .createContact(contactObj)
          .then((returnedContacts) => {
            setPersons(persons.concat(returnedContacts));
            setMessage({ text: `Added ${contactObj.name}`, type: 'success' });
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setMessage({ text: 'The contact was not added to the server', type: 'error' });
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
  
        setNewContact({name: '', number: ''});
      }
    }
  };  

  const handleDelete = (event) => {
    if(window.confirm(`Delete ${event.target.name} ?`)){
      service
      .deleteContact(event.target.value)
      .catch(error => {
        setMessage({ text: 'The contact was not deleted from the server', type: 'error' })
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      })

      setPersons(persons.filter(el => el.name !== event.target.name))
    }
  }

  const namesToShow = searchQuery
    ? persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : persons

  return (
    <div>
      <Notification message={message} />
      <h1>Phonebook</h1>
      <Filter searchQuery={searchQuery} handleQueryChange={handleQueryChange} />
      <h3>Add a new</h3>
      <PersonForm addContact={addContact} newContact={newContact} handleContactChange={handleContactChange} />
      <h3>Numbers</h3>
      <Contacts namesToShow={namesToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
