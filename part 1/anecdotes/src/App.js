import React, { useState } from 'react';

const MaximumVote = (props) => {
  const maxVote = Math.max(...props.voteCounts);
  const maxIndex = props.voteCounts.indexOf(maxVote);

  if (maxVote === 0) {
    return <p>No votes yet</p>;
  }

  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[maxIndex]}</p>
    </>
  );
};

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [voteCounts, setVoteCounts] = useState(new Array(6).fill(0));

  const handleVote = (selected) => {
    const updatedVotes = [...voteCounts];
    updatedVotes[selected] += 1;
    setVoteCounts(updatedVotes);
  };

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>Has {voteCounts[selected]} votes</p>
      <p>
        <button onClick={() => handleVote(selected)}>Vote</button>
        <button onClick={() => setSelected(Math.floor(Math.random() * 6))}>Next Anecdote</button>
      </p>
      <MaximumVote voteCounts={voteCounts} anecdotes={props.anecdotes} />
    </div>
  );
};

export default App;