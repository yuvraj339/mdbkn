// import { useCookie } from '#app';
// if (token && to.path === '/login') {
//   return navigateTo('/');
// }
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return navigateTo('/login');
  } else {
    return navigateTo('/');
  }
});
