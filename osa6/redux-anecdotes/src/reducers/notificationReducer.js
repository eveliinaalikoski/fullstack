import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
	initialState: '',
	reducers: {
		set(state, action) {
			return action.payload
		}
	}
})

export const setNotification = (message, time) => {
	return dispatch => {
		dispatch(set(message))
    setTimeout(() => {
      dispatch(set(''))
    }, time*1000)
	}
}

export const { set } = notificationSlice.actions
export default notificationSlice.reducer