import { createWebHistory, createRouter, createWebHashHistory } from "vue-router"
import { routes } from "@/router/routers"

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { top: 0 }
  },
})

export default router
