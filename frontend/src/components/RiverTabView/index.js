import React, { useState, useEffect } from 'react';
import { SegmentedControl } from 'gestalt';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Heading } from 'gestalt';

const TabViewContainer = styled.div`
  position: absolute;
  left: 5vw;
  top: 15vh;
  width: 30vw;
  z-index: ${props => props.displayOrder || 1001};
  cursor: move;
  background: white;
  border-radius: 8px;
`;

const ContentStyle = styled.div`
  padding: 5px 10px;
  overflow: auto;
  height: 60vh;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  &,
  th,
  td {
    border: 1px solid black;
  }
  td {
    text-align: center;
  }
`;

// data: { 2005: 1, 2006:2 ...}
const YearlyDeathTable = ({ data }) => {
  if (isEmpty(data)) return <h1>無資料顯示</h1>;

  return (
    <div>
      <Table>
        <tr>
          <th>年度</th>
          <th>全國</th>
          <th>學生</th>
        </tr>
        {Object.keys(data).map((year) => (
          <tr>
            <td>{year}</td>
            <td>N/A</td>
            <td>{data[year]}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

const RescuePlan = (props) => {
  return (
    <Table>
      <tr>
        <th>配套措施項目</th>
        <th>是否有設置</th>
      </tr>
      <tr>
        <td>有無設置安全設施<br />(e.g. 救生圈、拋繩、浮標)</td>
        <td>O</td>
      </tr>
      <tr>
        <td>有無設置警告標示</td>
        <td>O</td>
      </tr>
      <tr>
        <td>有無設置救生站/警戒站</td>
        <td>X</td>
      </tr>
      <tr>
        <td>有無設置救生員</td>
        <td>⌾六至八月設有救生員</td>
      </tr>
    </Table>
  );
};

const RiverTabView = (props) => {
  const { config, displayOrder } = props;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const items = [
    { name: '安全配套措施', content: <RescuePlan /> },
    {
      name: '歷年溺水死亡人數紀錄',
      content: <YearlyDeathTable data={config.history} />,
    },
  ];
  const names = items.map((i) => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <TabViewContainer {...props} displayOrder={displayOrder} >
      <Heading color="gray" size="md" align="center">
        {config.name}
      </Heading>
      <SegmentedControl
        selectedItemIndex={selectedItemIndex}
        onChange={handleOnChange}
        items={names}
      />
      <ContentStyle>{items[selectedItemIndex].content}</ContentStyle>
    </TabViewContainer>
  );
};

export default RiverTabView;
