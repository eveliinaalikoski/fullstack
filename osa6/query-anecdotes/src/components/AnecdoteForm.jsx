import { useQuery, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispath } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispath()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({type: 'SET', payload: `you created '${data.content}'`})
      setTimeout(() => {
        dispatch({type: 'SET', payload: ''})
      }, 5000)
    },
    onError: () => {
      dispatch({type: 'SET', payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => {
        dispatch({type: 'SET', payload: ''})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
