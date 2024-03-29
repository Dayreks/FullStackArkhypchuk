import React, { useState } from 'react'

const StatisticLine = ({text,value}) => {

  return (
    <>
      <td>{text}</td>
      <td>{value}</td>
    </>
  )

}

const Statistics = ({good, neutral, bad}) => {

  const total = good + neutral + bad
  const average = (good*1 + neutral*0 + bad*(-1))/(total)
  const positive = good*100/(total)

  if (total===0){
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }

  return (
    <>
    <table>
      <tbody>
      <tr><StatisticLine text="good" value={good} /></tr>
      <tr><StatisticLine text="neutral" value={neutral} /></tr>
      <tr><StatisticLine text="bad" value={bad} /></tr>
      <tr><StatisticLine text="all" value={total} /></tr>
      <tr><StatisticLine text="average" value={average} /></tr>
      <tr><StatisticLine text="positive" value={positive+" %"} /></tr>
      </tbody>
    </table>
    </>
  )

}

const Button = ({good, neutral, bad, ftnGood, ftnBad, ftnNeutral}) => {

  return (
    <>
      <button onClick={ftnGood}>good</button>
      <button onClick={ftnNeutral}>neutral</button>
      <button onClick={ftnBad}>bad</button>
    </>
  )

}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
        <Button ftnGood={() => setGood(good+1)} ftnNeutral={() => setNeutral(neutral+1)} ftnBad={() => setBad(bad+1)} />
      <h1>statistics</h1>
        <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  )

}

export default App;
