import {
    USER_REQUEST, USER_ERROR, USER_SUCCESS,
    USER_UPDATE, USER_UPDATE_SUCCESS, USER_UPDATE_ERROR
} from '../actions/user'
import api from '../../api/api'
import axios from 'axios'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/auth'
import { resolve } from 'path';
import { rejects } from 'assert';

const state = {
    status: '',
    profile: {

    }
}

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.IdUser,
    isAdmin: state => state.profile.type == 'admin'
}

const actions = {
    [USER_REQUEST]: ({ commit, dispatch, rootState }) => {
        api.defaults.headers.common['Authorization'] = 'Bearer ' +rootState.auth.token
        return new Promise((resolve, reject)=>{
            commit(USER_REQUEST)
            api.get('/user/account')
                .then(({ data }) => {
                   
                    console.log('Success auth ', data);
                    
                    commit(USER_SUCCESS, data)
                    resolve(state.status)
                })
                .catch(resp => {
                    console.log("error");
                    commit(USER_ERROR)
                    // if resp is unauthorized, logout, to
                    dispatch(AUTH_LOGOUT)
                    reject(state.status)
                })
        })
       
    },
    [USER_UPDATE]: ({ commit, dispatch, rootState }) => {
      //  api.defaults.headers.common['Authorization'] = 'Bearer ' + rootState.auth.token
        commit(USER_UPDATE)
        api.put('/user/account')
    }

}

const mutations = {
    [USER_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [USER_SUCCESS]: (state, resp) => {
        console.log('should success');
        state.status = 'success'
        Vue.set(state, 'profile', resp)
    },
    [USER_ERROR]: (state) => {
        state.status = 'error'
    },
    [AUTH_LOGOUT]: (state) => {
        state.profile = {}
    },
    [USER_UPDATE]: (state)=>{
        state.status = 'loading'
    },
    [USER_UPDATE_SUCCESS]: (state, data) => {
        state.status = 'success'
        Vue.set(state, 'profile', data)
    },
    [USER_UPDATE_ERROR]: (state)=>{
        state.status = 'error'
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}