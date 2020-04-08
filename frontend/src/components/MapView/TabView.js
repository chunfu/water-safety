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

const eventLocation = '發生地點名稱';
const eventMonth = '發生月份';
const eventAm = '發生時段(上/下午)';

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

const YearlyAccidentsTable = ({ data }) => {
  if (isEmpty(data)) return <h1>無資料顯示</h1>;

  const years = Object.keys(data);
  return years.map(y => {
    const accidents = data[y];
    return (
      <div>
        <h2>{y}</h2>
        <Table>
          <tr>
            <th>地區</th>
            <th>發生時間</th>
            <th>發生時段</th>
          </tr>
          {accidents.map(accident => (
            <tr>
              <td>{accident[eventLocation]}</td>
              <td>{accident[eventMonth]}</td>
              <td>{accident[eventAm]}</td>
            </tr>
          ))}
        </Table>
      </div>
    );
  });
};

const TabView = props => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { config } = props;
  const { yearlyAccidents = {} } = config;

  const items = [
    {
      name: '發生學生溺水死亡意外之水域',
      content: <YearlyAccidentsTable data={yearlyAccidents} />,
    },
    { name: '重覆發生學生溺水死亡意外之水域', content: <h1>暫無資料</h1> },
  ];
  const names = items.map(i => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <TabViewContainer {...props} >
      <Heading color="gray" size="md" align="center">
        {config.name[0]}
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

export default TabView;
