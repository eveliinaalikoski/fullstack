const Course = ({course}) => {
    return (
      <div>
        <Header coursename={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
}
  
const Header = ({coursename}) => {
    return (
      <h2>
        {coursename}
      </h2>
    )
}
  
const Content = ({parts}) => {
    console.log({parts})
    return (
      parts.map(part =>
        <Part key={part.id} part={part} />
      )
    )
}
  
const Part = ({part}) => {
    console.log({part})
    return (
      <p>
        {part.name} {part.exercises}
      </p>
    )
}
  
const Total = ({parts}) => {
    const TotalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <b>
        total of {TotalExercises} exercises
      </b>
    )
}

export default Course