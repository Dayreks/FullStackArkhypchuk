import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {

  switch (action.type) {
    case 'UPVOTE':
      const id = action.data.id
      const anectodeToUpvote = state.find(element => element.id === id)
      const upvotedAnecdote = {
        ...anectodeToUpvote,
        votes: anectodeToUpvote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : upvotedAnecdote
      )

    case 'NEW':
      return state.concat(action.data)

    case 'INIT':
      return action.data

    default:
      return state

  }
}

export const voteAction = (anecdote) => {
  return async dispatch => {
    const upvotedAnecdote = await anecdoteService.upvote(anecdote)
    const id = upvotedAnecdote.id
    dispatch({
      type: 'UPVOTE',
      data: { id }
    })
  }
}

export const createAction = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'NEW',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdotes
    })
  }
}

export default anecdoteReducer