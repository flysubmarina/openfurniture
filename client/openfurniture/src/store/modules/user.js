import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import api from '../../api/api'
import axios from 'axios'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/auth'

const state = {
    status: '',
    profile: {

    }
}

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.IdUser,
}

const actions = {
    [USER_REQUEST]: ({ commit, dispatch , rootState}) => {
        console.log("AUTH TOKEN ROOT: " + rootState.auth.token);
        axios.defaults.headers.common['Authorization'] = 'Bearer '+rootState.auth.token
        commit(USER_REQUEST)
        api.get('/user/account')
        .then(({data}) => {
            console.log('Success auth ' + data.login);
            commit(USER_SUCCESS, data)
        })
        .catch(resp => {
            console.log();
            commit(USER_ERROR)
                // if resp is unauthorized, logout, to
            dispatch(AUTH_LOGOUT)
        })
    },
}

const mutations = {
    [USER_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = 'success'
        Vue.set(state, 'profile', resp)
    },
    [USER_ERROR]: (state) => {
        state.status = 'error'
    },
    [AUTH_LOGOUT]: (state) => {
        state.profile = {}
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}