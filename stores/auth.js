import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: undefined
  }),
  actions: {
    authenticateUser(status) {
      this.isAuthenticated = status;
    },
    currentUser(user) {
      this.user = user;
      this.setLocalstorage();
    },
    logout() {
      this.authenticateUser(false);
      this.user = undefined;
      this.setLocalstorage();
    },
    setLocalstorage() {
      // localstorage.setItem('isAuthenticated', JSON.stringify(this.isAuthenticated));
      // localstorage.setItem('user', JSON.stringify(user));
    }
    // loadAuthState() {
    //   if (process.client) {
    //     // Retrieve stored authentication state when available in the client
    //     const auth = JSON.parse(localStorage.getItem('isAuthenticated'));
    //     const user = JSON.parse(localStorage.getItem('currentUser'));

    //     if (auth) this.isAuthenticated = auth;
    //     if (user) this.currentUser = user;
    //   }
    // }
  }
});
