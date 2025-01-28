const Persons = ({ persons }) => {
    return (
        persons.map(person => (
            <Person key={person.id} person={person} />
        ))
    )
}

const Person = ({person}) => {
    return (
      <p>{person.name} {person.number}</p>
    )}

export default Persons