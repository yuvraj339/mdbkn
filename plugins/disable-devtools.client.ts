export default defineNuxtPlugin(() => {
  //   if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = null;
  //   }
});
