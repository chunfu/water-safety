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
  z-index: 1001;
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

const RiverTabView = props => {
  const { config } = props;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const items = [
    {
      name: '歷年溺水死亡人數紀錄',
      content: <p>{JSON.stringify(config.history)}</p>,
    },
    { name: '即時風險因子提醒', content: <h1>暫無資料</h1> },
  ];
  const names = items.map(i => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <TabViewContainer>
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
