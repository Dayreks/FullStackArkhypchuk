import React from 'react'

const PersonForm = ({addContact, newContact, handleContactChange}) => {
  return (
    <form onSubmit={addContact}>
      <div>
        <div>name: <input name="name" value={newContact.name} onChange={handleContactChange} /></div>
        <div>number: <input name="number" value={newContact.number} onChange={handleContactChange} /></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
