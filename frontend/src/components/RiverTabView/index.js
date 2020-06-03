import React, { useState, useEffect } from 'react';
import { Modal, SegmentedControl, Box, Text, Button } from 'gestalt';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Heading } from 'gestalt';

const TabViewContainer = styled.div`
  position: absolute;
  left: 5vw;
  top: 15vh;
  width: 30vw;
  z-index: ${(props) => props.displayOrder || 401};
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

const modalStyle = {
  overlay: {
    zIndex: 402,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const RescuePlan = ({ points }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {points.map((p) => {
        return (
          <>
            <Box
              alignItems="center"
              direction="row"
              display="flex"
              marginStart={-1}
              marginEnd={-1}
              marginBottom={2}
            >
              <Box paddingX={1} flex="grow">
                <Text weight="bold">{p}</Text>
              </Box>
              <Box paddingX={1}>
                <Button
                  text="安全配套措施"
                  size="sm"
                  color="gray"
                  onClick={() => setShow(true)}
                />
              </Box>
            </Box>
          </>
        );
      })}
      <ReactModal
        isOpen={show}
        onRequestClose={() => setShow(false)}
        style={modalStyle}
      >
        <Table>
          <tr>
            <th>配套措施項目</th>
            <th>是否有設置</th>
          </tr>
          <tr>
            <td>
              有無設置安全設施
              <br />
              (e.g. 救生圈、拋繩、浮標)
            </td>
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
      </ReactModal>
    </>
  );
};

const H2 = styled.h2`
  color: red;
`;
const Announcement = ({ text }) => {
  return <H2>{text}</H2>;
};

const RiverTabView = (props) => {
  const { config, displayOrder } = props;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    // reset index every rerender
    setSelectedItemIndex(0);
  }, [config]);

  const {
    name,
    history,
    purple,
    yellow,
    red,
    ppoints,
    announcement: announcementText,
  } = config;

  let warningRivers = null;
  if (ppoints.length) {
    warningRivers = {
      name: '縣市公告警示水域',
      content: <RescuePlan points={ppoints} />,
    };
  }

  if (purple && !yellow && !red) {
    warningRivers = {
      name: '縣市公告警示水域',
      content: <RescuePlan points={[name]} />,
    };
  }

  let announcement = null;
  if (red) {
    announcement = {
      name: '禁止公告',
      content: <Announcement text={announcementText} />,
    };
  }

  let deathRecords = null;
  if (!isEmpty(history)) {
    deathRecords = {
      name: '歷年溺水死亡人數紀錄',
      content: <YearlyDeathTable data={config.history} />,
    };
  }

  const items = [announcement, warningRivers, deathRecords].filter((v) => v);
  const names = items.map((i) => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <TabViewContainer {...props} displayOrder={displayOrder}>
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
