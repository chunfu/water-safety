import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Heading, Button, TextField } from 'gestalt';
import userManagement from '../../utils/userManagement';

const defaultLocationState = { from: { pathname: '/' } };

const LoginPage = () => {
  let history = useHistory();
  let location = useLocation();

  const { from } = location.state || defaultLocationState;

  const login = () => {
    userManagement.authenticate(() => {
      history.replace(from);
    });
  };

  const cancel = () => {
    history.replace(defaultLocationState.from);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      marginLeft="auto"
      marginRight="auto"
      marginBottom={0}
      marginTop={0}
      wrap
      width="100%"
      direction="column"
      maxWidth={800}
    >
      <Box flex="grow" paddingX={3} paddingY={3}>
        <Heading size="sm" accessibilityLevel={2}>
          登入
        </Heading>
      </Box>

      <Box flex="grow" paddingX={3} paddingY={3}>
        <TextField label="帳號" onChange={() => {}} placeholder="帳號" />
      </Box>

      <Box flex="grow" paddingX={3} paddingY={3}>
        <TextField label="密碼" onChange={() => {}} placeholder="密碼" />
      </Box>

      <Box flex="grow" paddingX={3} paddingY={3}>
        <Box
          justifyContent="end"
          marginStart={-1}
          marginRight={-1}
          marginTop={-1}
          marginBottom={-1}
          display="flex"
          wrap
        >
          <Box paddingX={1} paddingY={1}>
            <Button text="取消" size="lg" inline onClick={cancel} />
          </Box>
          <Box paddingX={1} paddingY={1}>
            <Button
              text="送出"
              color="red"
              size="lg"
              type="submit"
              onClick={login}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
