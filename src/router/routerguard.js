import router from "./index";

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})