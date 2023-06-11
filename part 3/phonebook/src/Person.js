const Person = ({person, handleDelete}) => {
    return(
        <div>
        <p key={person.id}>{person.name} {person.number}</p>
        <button value={person.id} name={person.name} onClick={handleDelete}>delete</button>
        </div>
    );
}

export default Person; 