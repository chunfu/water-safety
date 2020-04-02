import React, { useState, useEffect } from 'react';
import { SegmentedControl } from 'gestalt';
import styled from 'styled-components';

const ContentStyle = styled.div`
  background: white;
  height: 100%;
  width: 100%;
`;

const TabView = props => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { items } = props;
  const names = items.map(i => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <ContentStyle>
      <SegmentedControl
        selectedItemIndex={selectedItemIndex}
        onChange={handleOnChange}
        items={names}
      />
      {items[selectedItemIndex].content}
    </ContentStyle>
  );
};

export default TabView;
