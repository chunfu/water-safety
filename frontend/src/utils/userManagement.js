const fakeAuth = {
  isAuthenticated: false,
  async authenticate({ account, password }) {
    if (account === 'newtaipei' && password === 'newtaipei') {
      fakeAuth.isAuthenticated = true;
    }
    return fakeAuth.isAuthenticated;
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

export default fakeAuth;
