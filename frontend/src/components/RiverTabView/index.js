import React, { useState, useEffect, useMemo } from 'react';
import { SegmentedControl, Box, Text, Button } from 'gestalt';
import ReactModal from 'react-modal';
import { isEmpty } from 'lodash';
import { Heading } from 'gestalt';
import { TabViewContainer, ContentStyle, Table, H2 } from '../StyledComps';

const cwb = 'https://www.cwb.gov.tw/V8/C/';
const eocdss = 'http://eocdss.ncdr.nat.gov.tw/';

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
              marginBottom={2}
              justifyContent="between"
            >
              <Box paddingX={1}>
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

const Announcement = ({ text }) => {
  return <H2>{text}</H2>;
};

const RiverTabView = (props) => {
  const { keyName, config, displayOrder } = props;
  const {
    name,
    history,
    purple,
    yellow,
    red,
    ppoints,
    announcement: announcementText,
  } = config;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    // reset index every rerender
    setSelectedItemIndex(0);
  }, [name]);

  const items = useMemo(() => {
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
        content: <RescuePlan points={[keyName]} />,
      };
    }

    let announcement = null;
    if (red) {
      announcement = {
        name: '禁止公告',
        content: <Announcement text={announcementText} />,
      };
    }

    let safetyCondition = null;
    // yellow only
    if (!warningRivers && !announcement) {
      safetyCondition = {
        name: '安全措施設置狀態',
        content: <RescuePlan points={[keyName]} />,
      };
    }

    let deathRecords = null;
    if (!isEmpty(history)) {
      deathRecords = {
        name: '歷年溺水死亡人數紀錄',
        content: <YearlyDeathTable data={config.history} />,
      };
    }

    return [announcement, warningRivers, safetyCondition, deathRecords].filter(
      (v) => v,
    );
  }, [name]);

  const names = items.map((i) => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  const selectedItem =
    items[selectedItemIndex] && items[selectedItemIndex].content;
  return (
    <TabViewContainer {...props}>
      <Heading color="darkGray" size="md" align="center">
        {keyName}
      </Heading>
      <SegmentedControl
        selectedItemIndex={selectedItemIndex}
        onChange={handleOnChange}
        items={names}
        size="lg"
      />
      <ContentStyle>{selectedItem}</ContentStyle>
      <Box display="flex" justifyContent="center">
        即時天氣狀況請查詢
        <a href={cwb} target="_blank" rel="noopener noreferrer">
          氣象局
        </a>
        及
        <a href={eocdss} target="_blank" rel="noopener noreferrer">
          災害情資網
        </a>
      </Box>
    </TabViewContainer>
  );
};

export default RiverTabView;
