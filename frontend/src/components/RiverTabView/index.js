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
        {data.map((d) => (
          <tr>
            <td>{d[0]}</td>
            <td>{d[1]}</td>
            <td>{d[2]}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

const RealTimeReminder = (props) => {
  return (
    <Table>
      <tr>
        <td>雨量</td>
        <td>豪雨</td>
      </tr>
      <tr>
        <td>河川水位</td>
        <td>上升</td>
      </tr>
    </Table>
  );
};

const RiverTabView = (props) => {
  const { config, displayOrder } = props;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const items = [
    {
      name: '歷年溺水死亡人數紀錄',
      content: <YearlyDeathTable data={config.history} />,
    },
    { name: '即時風險因子提醒', content: <RealTimeReminder /> },
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
