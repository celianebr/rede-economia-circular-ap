import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Search from '../views/Search.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/search', component: Search, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)

  // O Firebase precisa de onAuthStateChanged para garantir que o estado do usuário está atualizado
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/login')
    } else {
      next()
    }
  })
})

export default router
