import * as jwt from 'jsonwebtoken';
import { get } from 'lodash';
import { JWT_SECRET } from '../lib/const';

const fakeLoginMap = {
  admin: {
    role: 'admin',
    password: 'admin',
  },
  newtaipei: {
    role: 'normal',
    password: 'newtaipei',
  },
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const userInfo = fakeLoginMap[username];
  const userPassword = get(userInfo, 'password', '');

  if (password === userPassword) {
    const token = jwt.sign(
      {
        username,
        role: userInfo.role,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
      },
      JWT_SECRET
    );

    res.json({ token });
  } else {
    res.status(401).json({ err: 'Incorrect username or password' });
  }
};
