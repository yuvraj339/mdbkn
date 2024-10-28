import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: []
  }),
  actions: {
    authenticateUser(status) {
      this.isAuthenticated = status;
    },
    currentUser(user) {
      this.currentUser = user;
    }
  }
});
