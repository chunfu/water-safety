import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'gestalt';
import userManagement from '../../utils/userManagement';

const Container = styled.div`
  position: absolute;
  z-index: 401;
  right: 5vw;
  top: 1vh;
  width: 200px;
  a {
    text-decoration: none;
  }
`;

const UploadButton = () => {
  const { isAuthenticated } = userManagement;
  return (
    isAuthenticated && (
      <Container>
        <Link to="/upload">
          <Button text="上傳檔案" />
        </Link>
      </Container>
    )
  );
};

export default UploadButton;
