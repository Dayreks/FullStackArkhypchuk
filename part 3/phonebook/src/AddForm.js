const AddForm = ({changeNameValue, changePhoneValue, addPerson}) => {

    return(
        <form>
        <h2>add a new</h2>
        <div>name: <input id='nameInput' onChange={changeNameValue}/></div>
        <div>number: <input id='phoneInput' onChange={changePhoneValue} /></div>
      <div>
        <button type="submit" onClick={addPerson}>add</button>
      </div>
    </form>
    );
}

export default AddForm; 