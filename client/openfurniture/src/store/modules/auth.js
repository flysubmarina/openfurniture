import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import api from '../../api/api'
import axios from 'axios'
const state = {
    number: localStorage.getItem('number') || 0,
    token: localStorage.getItem('user-token') || '',
    status: '',
    hasLoadedOnce: false
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
}

const actions = {
    [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST)
            api.post('/user/login', user)
                .then(({ data }) => {
                    console.log(data);
                    if (data.err) {

                        if (data.err.message == 'Invalid login or password') {
                            commit(AUTH_ERROR)
                        }
                        resolve(data)
                    } else {

                        localStorage.setItem('user-token', data.token)
                        // Here set the header of your ajax library to the token value.
                        // example with axios

                        
                        commit(AUTH_SUCCESS, data)
                        dispatch(USER_REQUEST)
                        resolve(data)
                    }

                })
                .catch(err => {
                    console.log(err);
                    commit(AUTH_ERROR, err)
                    localStorage.removeItem('user-token')
                    reject(err)
                })
        })
    },
    [AUTH_LOGOUT]: ({ commit, dispatch }) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_LOGOUT)
            api.post('/user/logout').then(resp=>{
                localStorage.removeItem('user-token')
                resolve()
            })

        })
    }
}

const mutations = {
    [AUTH_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, resp) => {
        state.status = 'success'
        state.token = resp.token
        state.hasLoadedOnce = true
    },
    [AUTH_ERROR]: (state) => {
        state.status = 'error'
        state.hasLoadedOnce = true
    },
    [AUTH_LOGOUT]: (state) => {
        state.token = ''
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}