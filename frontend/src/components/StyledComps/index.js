import styled, { css } from 'styled-components';

const mapBackgroundColor = css`
  background: transparent;
`;

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
  [aria-selected='true'] {
    border: 1px solid black;
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

const SelectListContainer = styled.div`
  position: absolute;
  right: 5vw;
  top: ${(props) => props.top || '15vh'};
  bottom: ${(props) => props.bottom || ''};
  width: 200px;
  z-index: 401;
  ${mapBackgroundColor}
`;

const Tooltip = styled.div`
  position: absolute;
  right: 5vw;
  top: ${(props) => props.top || '35vh'};
  bottom: ${(props) => props.bottom || ''};
  width: 200px;
  z-index: 401;
  ${mapBackgroundColor}
  > div {
    margin-bottom: 10px;
  }
  .marker-div-icon {
    margin-right: 10px;
  }
`;

const RightIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 20px;
  cursor: pointer;
`;

export {
  TabViewContainer,
  ContentStyle,
  Table,
  H2,
  SelectListContainer,
  Tooltip,
  RightIcon,
};
