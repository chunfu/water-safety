import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const fakeAuth = {
  isAuthenticated: () => !!localStorage.getItem('token'),
  async authenticate(cred) {
    const { data } = await axios.post('/api/login', cred);
    localStorage.setItem('token', data.token);
  },
  async signout(cb = () => null) {
    localStorage.removeItem('token');
    cb();
    return fakeAuth.isAuthenticated();
  },
};

export default fakeAuth;
