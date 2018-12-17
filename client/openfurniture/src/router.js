import Vue from 'vue'
import Router from 'vue-router'
import AddPage from './views/AddPage.vue'
import Profile from './views/Profile.vue'
import Login from './views/Login.vue'
import Welcome from './views/Welcome.vue'
import store from './store'
import {AUTH_LOGOUT} from './store/actions/auth'
Vue.use(Router)


const ifNotAuthenticated = (to, from, next) => {
  console.log(store);
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  console.log("got to / in router");
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path:'/logout',
      beforeEnter(to,from,next){
        store.dispatch(AUTH_LOGOUT).then(res=>{
          next('/login')
        }).catch(err=>{
          next('/')
        })
      }
    },
    {
      path:'/account',
      component: Profile,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/',
      component: Welcome,  
    }
    
  ]
})
