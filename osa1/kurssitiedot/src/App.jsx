const Header = ({coursename}) => {
  return (
    <h1>
      {coursename}
    </h1>
  )
}

const Part = ({prop}) => {
  console.log(prop)
  return (
    <p>
      {prop.name} {prop.exercises}
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
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header coursename={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App