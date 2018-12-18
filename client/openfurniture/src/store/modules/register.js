import { REGISTER_REQUEST, REGISTER_ERROR, REGISTER_SUCCESS } from '../actions/register'
import {AUTH_REQUEST} from '../actions/auth'
import api from '../../api/api'
import axios from 'axios'
const state = {
    status: '',
    hasLoadedOnce: false
}

const getters = {
    registerhStatus: state => state.status,
}

const actions = {
    [REGISTER_REQUEST]: ({ commit, dispatch }, user) => {
        return new Promise((resolve, reject) => {
            commit(REGISTER_REQUEST)
            api.post('/user/register', user)
                .then(({ data }) => {
                    console.log(data);
                    if (data.err) {
                        commit(REGISTER_ERROR)
                        resolve(data)
                    } else {
                        commit(REGISTER_SUCCESS)
                     //   dispatch(AUTH_REQUEST)
                        resolve(data)
                    }

                })
                .catch(err => {
                    console.log(err);
                    commit(REGISTER_ERROR, err)
                    reject(err)
                })
        })
    },
}

const mutations = {
    [REGISTER_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [REGISTER_SUCCESS]: (state) => {
        state.status = 'success'
        state.hasLoadedOnce = true
    },
    [REGISTER_ERROR]: (state) => {
        state.status = 'error'
        state.hasLoadedOnce = true
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}