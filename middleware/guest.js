// import { useCookie } from '#app';
// import { useRoute } from 'vue-router';

// export default defineNuxtRouteMiddleware(() => {
//   const token = useCookie('token');
//   const route = useRoute(); // Get the current route

//   // If the user is authenticated and trying to access the login page, redirect to home
//   if (token.value && route.path === '/login') {
//     return navigateTo('/');
//   }

//   // If the user is not authenticated and trying to access a protected page, redirect to login
//   if (!token.value && route.path !== '/login') {
//     return navigateTo('/login');
//   }
// });

// import { useCookie } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value;

  // Redirect authenticated users away from the login page to the homepage
  if (token && to.path === '/login') {
    return navigateTo('/');
  }

  // Redirect unauthenticated users to login if they try to access protected pages
  if (!token && to.path !== '/login') {
    return navigateTo('/login');
  }
});
