const eventCounty = '發生所在縣市';
const eventLocation = '發生地點名稱(調)';
const eventMonth = '發生月份';
const eventAm = '發生時段(上/下午)';
const eventYear = '年度';
const eventTime = '發生時段';

const redAnnouncementSheetName = '禁止公告';
const purpleRedSheetName = '總表';
const prCountyCol = '所在縣市';
const prPurpleCol = '水域名稱(紫點)';
const prYellowCol = '學生溺水分析調整後的發生地點(黃點)';
const prRedCol = '禁止公告(紅點)';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export {
  API_KEY,

  eventCounty,
  eventLocation,
  eventYear,
  eventMonth,
  eventAm,
  eventTime,

  redAnnouncementSheetName,
  purpleRedSheetName,
  prCountyCol,
  prPurpleCol,
  prYellowCol,
  prRedCol,
};
