import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: undefined,
    record: { name: '', mobile: '', email: '', password: '' }
  }),
  actions: {
    authenticateUser(status) {
      this.isAuthenticated = status;
      this.setLocalStorage();
    },
    currentUser(user) {
      this.user = user;
      this.setLocalStorage();
    },
    logout() {
      this.authenticateUser(false);
      this.user = undefined;
      // this.setLocalStorage();
      localStorage.setItem('isAuthenticated', JSON.stringify(false));
      localStorage.setItem('user', undefined);
    },
    setLocalStorage() {
      // if (process.client) {
      // Ensures this only runs on the client side
      localStorage.setItem('isAuthenticated', JSON.stringify(this.isAuthenticated));
      localStorage.setItem('user', JSON.stringify(this.user));
      // }
    },
    updateOnReload() {
      let auth = JSON.parse(localStorage.getItem('isAuthenticated'));
      let localStUser = localStorage.getItem('user');
      let user = localStUser != 'undefined' ? JSON.parse(localStUser) : undefined;

      if (auth) {
        this.isAuthenticated = auth;
      }
      this.user = user;
      if (user) {
        this.record.name = user.name;
        this.record.mobile = user.mobile;
        this.record.email = user.email;
      }
    }
  }
});
