import React from 'react'

const Course = ({courses}) => {
  return (
    <>
      {
        courses.map(el =>
        <div key={el.id}>
          <h1>{el.name}</h1>
          <Part parts={el.parts}/>
        </div>
        )
      }
    </>
  )
}

const Part = ({parts}) => {

  const total = parts.map(x => x.exercises).reduce((a,b) => a+b, 0)

  return (
    <>
      {
        parts.map(ele =>
        <div key={ele.id}>
        <p>{ele.name} {ele.exercises}</p>
        </div>)
      }
      {
        <b>total of {total} exercises</b>
      }
    </>
  )
}

export default Course