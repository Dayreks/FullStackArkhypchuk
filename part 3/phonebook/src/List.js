import Person from "./Person";

const List = ({namesToShow, handleDelete}) => {

    return(
        namesToShow.map(person => {
            return <Person key={person.id} person={person} handleDelete={handleDelete}/> 
          })
    );
}

export default List; 