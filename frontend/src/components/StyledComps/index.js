import React from 'react';
import styled from 'styled-components';

const TabViewContainer = styled.div`
  position: absolute;
  left: 5vw;
  top: 15vh;
  width: 30vw;
  z-index: ${(props) => props.displayOrder || 401};
  cursor: move;
  background: white;
  border-radius: 8px;
  padding: 10px;
  h2 {
    margin-bottom: 10px;
  }
  [aria-selected=true] {
    color: yellow;
  }
`;

const ContentStyle = styled.div`
  padding: 10px 0;
  overflow: auto;
  height: 60vh;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  &,
  th,
  td {
    padding: 5px;
    background: #ddd;
    border-bottom: 2px solid white; 
  }
  th {
    background: #111;
    color: white;
  }
  td {
    text-align: center;
  }

  th:first-child {
    width: 180px;
  }
`;

const H2 = styled.h2`
  color: red;
`;

export { TabViewContainer, ContentStyle, Table, H2 };
