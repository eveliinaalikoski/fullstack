const Header = ({course}) => {
  console.log(course)
  return (
    <h1>
      {course}
    </h1>
  )
}

const Part = ({prop}) => {
  console.log(prop)
  return (
    <p>
      {prop.part} {prop.exercises}
    </p>
  )
}

const Content = ({parts}) => {
  console.log(parts)
  return (
    <div>
      <Part prop={parts[0]}/>
      <Part prop={parts[1]}/>
      <Part prop={parts[2]}/>
    </div>
  )
}

const Total = ({parts}) => {
  return (
    <p>
      Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {part: 'Fundamentals of React', exercises: 10},
    {part: 'Using props to pass data', exercises: 7},
    {part: 'State of a component', exercises: 14}
  ]
  
  return (
    <div>
      <Header course={course}/>
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App