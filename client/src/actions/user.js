import * as api from '../api/index';

export const signin = (data, history) => async (dispatch) => {
    try {
        dispatch({
            type: 'SIGNIN',
            payload: data,
        })

        history.push('/')
    } catch (error) {
        console.log(error);
    }
}