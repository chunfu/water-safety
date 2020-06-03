import React, { useState, useMemo } from 'react';
import { SegmentedControl } from 'gestalt';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Heading } from 'gestalt';
import {
  eventAm,
  eventLocation,
  eventYear,
  eventMonth,
  eventTime,
} from '../../const';
import { groupBy, uniqBy } from 'lodash';

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
  th:first-child {
    width: 180px;
  }
`;

const ForbiddenRiverTable = ({ data }) => {
  return (
    <div>
      <Table>
        <tr>
          <th>水域名稱</th>
          <th>禁止範圍</th>
        </tr>
        <tr>
          <td>南勢溪</td>
          <td>
            南勢溪水域下龜山橋、萬年 橋至桂山電廠附近水域禁止 從事水域遊憩活動。
          </td>
        </tr>
      </Table>
    </div>
  );
};

const YearlyAccidentsTable = ({ data }) => {
  if (isEmpty(data)) return <h1>無資料顯示</h1>;

  const years = Object.keys(data);
  return years
    .sort((a, b) => b - a)
    .map((y) => {
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
            {accidents.map((accident) => (
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

const DangerRiverTable = ({ data }) => {
  if (isEmpty(data)) return <h1>無資料顯示</h1>;

  const rivers = Object.keys(data);
  return (
    <Table>
      <tr>
        <th>地區</th>
        <th>年度</th>
        <th>月份</th>
        <th>時段</th>
      </tr>
      {rivers
        .sort((a, b) => data[b].length - data[a].length)
        .map((r) => {
          const accidents = data[r];
          return accidents
            .sort((a, b) => b[eventYear] - a[eventYear])
            .map((accident, i) => {
              return (
                <tr>
                  {i === 0 && <td rowspan={accidents.length}>{r}</td>}
                  <td>{accident[eventYear]}</td>
                  <td>{accident[eventMonth]}</td>
                  <td>{accident[eventAm]}</td>
                </tr>
              );
            });
        })}
    </Table>
  );
};

const CountyTabView = (props) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { config } = props;
  const { accidentData = [] } = config;
  const uniqAccidentData = uniqBy(
    accidentData,
    (d) => `${d[eventYear]}${d[eventMonth]}${d[eventAm]}${d[eventTime]}`,
  );
  const yearlyAccidents = groupBy(uniqAccidentData, eventYear);
  const dangerRivers = groupBy(uniqAccidentData, eventLocation);

  const items = useMemo(
    () => [
      {
        name: '禁止前往水域',
        content: <ForbiddenRiverTable />,
      },
      {
        name: '重覆發生學生溺水死亡意外之水域',
        content: <DangerRiverTable data={dangerRivers} />,
      },
      {
        name: '歷年發生學生溺水死亡意外之水域',
        content: <YearlyAccidentsTable data={yearlyAccidents} />,
      },
    ],
    [yearlyAccidents, dangerRivers],
  );

  const names = items.map((i) => i.name);

  const handleOnChange = ({ activeIndex }) => setSelectedItemIndex(activeIndex);

  return (
    <TabViewContainer {...props}>
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

export default CountyTabView;
