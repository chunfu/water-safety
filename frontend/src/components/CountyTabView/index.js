import React, { useState, useMemo, useEffect } from 'react';
import { SegmentedControl } from 'gestalt';
import { isEmpty, groupBy, uniqBy } from 'lodash';
import { Heading } from 'gestalt';
import { TabViewContainer, ContentStyle, Table } from '../StyledComps';
import {
  eventAm,
  eventLocation,
  eventYear,
  eventMonth,
  eventTime,
} from '../../const';

const ForbiddenRiverTable = ({ data }) => {
  return (
    <div>
      <Table>
        <tr>
          <th>水域名稱</th>
          <th>禁止公告</th>
        </tr>
        {data.map((d) => {
          const { name, announcement } = d;
          return (
            <tr>
              <td>{name}</td>
              <td>{announcement}</td>
            </tr>
          );
        })}
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
        .filter((r) => data[r].length > 1)
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
  const { keyName, config, rivers } = props;

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  useEffect(() => {
    // reset index every rerender
    setSelectedItemIndex(0);
  }, [config]);

  const { accidentData = [] } = config;
  const uniqAccidentData = uniqBy(
    accidentData,
    (d) => `${d[eventYear]}${d[eventMonth]}${d[eventAm]}${d[eventTime]}`,
  );
  const yearlyAccidents = groupBy(uniqAccidentData, eventYear);
  const dangerRivers = groupBy(uniqAccidentData, eventLocation);
  const forbiddenRivers = rivers.filter((r) => r.red);

  const items = useMemo(
    () => [
      {
        name: '禁止前往水域',
        content: <ForbiddenRiverTable data={forbiddenRivers} />,
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
    </TabViewContainer>
  );
};

export default CountyTabView;
