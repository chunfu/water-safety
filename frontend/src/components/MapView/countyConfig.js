import ChanghuaGeoJson from '../../geojson/changhua.json';
import ChiayiGeoJson from '../../geojson/chiayi.json';
import ChiayiCityGeoJson from '../../geojson/chiayicity.json';
import HsinchuGeoJson from '../../geojson/hsinchu.json';
import HsinchuCityGeoJson from '../../geojson/hsinchucity.json';
import HualienGeoJson from '../../geojson/hualien.json';
import KaohsiungGeoJson from '../../geojson/kaohsiung.json';
import KeelungGeoJson from '../../geojson/keelung.json';
import KinmenGeoJson from '../../geojson/kinmen.json';
import LienchiangGeoJson from '../../geojson/lienchiang.json';
import MiaoliGeoJson from '../../geojson/miaoli.json';
import NantouGeoJson from '../../geojson/nantou.json';
import NewTaipeiGeoJson from '../../geojson/newtaipei.json';
import PenghuGeoJson from '../../geojson/penghu.json';
import PingtungGeoJson from '../../geojson/pingtung.json';
import TaichungGeoJson from '../../geojson/taichung.json';
import TainanGeoJson from '../../geojson/tainan.json';
import TaipeiGeoJson from '../../geojson/taipei.json';
import TaitungGeoJson from '../../geojson/taitung.json';
import TaoyuanGeoJson from '../../geojson/taoyuan.json';
import YilanGeoJson from '../../geojson/yilan.json';
import YunlinGeoJson from '../../geojson/yunlin.json';

const changhua = '彰化縣';
const chiayi = '嘉義縣';
const chiayicity = '嘉義市';
const hsinchu = '新竹縣';
const hsinchucity = '新竹市';
const hualien = '花蓮縣';
const kaohsiung = '高雄市';
const keelung = '基隆市';
const kinmen = '金門縣';
const lienchiang = '連江縣';
const miaoli = '苗栗縣';
const nantou = '南投縣';
const newtaipei = '新北市';
const penghu = '澎湖縣';
const pingtung = '屏東縣';
const taichung = '台中市';
const tainan = '台南市';
const taipei = '台北市';
const taitung = '台東縣';
const taoyuan = '桃園縣';
const yilan = '宜蘭縣';
const yunlin = '雲林縣';
// same county can have multiple name
const defaultCountyConfig = {
  [changhua]: { name: ['彰化縣'], geojson: ChanghuaGeoJson, order: 8 },
  [chiayi]: { name: ['嘉義縣'], geojson: ChiayiGeoJson, order: 12 },
  [chiayicity]: { name: ['嘉義市'], geojson: ChiayiCityGeoJson, order: 11 },
  [hsinchu]: { name: ['新竹縣'], geojson: HsinchuGeoJson, order: 5 },
  [hsinchucity]: { name: ['新竹市'], geojson: HsinchuCityGeoJson, order: 4 },
  [hualien]: { name: ['花蓮縣'], geojson: HualienGeoJson, order: 17 },
  [kaohsiung]: {
    name: ['高雄市', '高雄縣'],
    geojson: KaohsiungGeoJson,
    order: 14,
  },
  [keelung]: { name: ['基隆市'], geojson: KeelungGeoJson, order: 0 },
  [kinmen]: { name: ['金門縣'], geojson: KinmenGeoJson, order: 20 },
  [lienchiang]: { name: ['連江縣'], geojson: LienchiangGeoJson, order: 21 },
  [miaoli]: { name: ['苗栗縣'], geojson: MiaoliGeoJson, order: 6 },
  [nantou]: { name: ['南投縣'], geojson: NantouGeoJson, order: 9 },
  [newtaipei]: {
    name: ['新北市', '台北縣', '臺北縣'],
    geojson: NewTaipeiGeoJson,
    order: 2,
  },
  [penghu]: { name: ['澎湖縣'], geojson: PenghuGeoJson, order: 19 },
  [pingtung]: { name: ['屏東縣'], geojson: PingtungGeoJson, order: 15 },
  [taichung]: {
    name: ['台中市', '臺中市', '台中縣', '臺中縣'],
    geojson: TaichungGeoJson,
    order: 7,
  },
  [tainan]: {
    name: ['台南市', '臺南市', '台南縣', '臺南縣'],
    geojson: TainanGeoJson,
    order: 13,
  },
  [taipei]: { name: ['台北市', '臺北市'], geojson: TaipeiGeoJson, order: 1 },
  [taitung]: {
    name: ['台東縣', '臺東縣', '台東市'],
    geojson: TaitungGeoJson,
    order: 16,
  },
  [taoyuan]: { name: ['桃園縣', '桃園市'], geojson: TaoyuanGeoJson, order: 3 },
  [yilan]: { name: ['宜蘭縣'], geojson: YilanGeoJson, order: 18 },
  [yunlin]: { name: ['雲林縣'], geojson: YunlinGeoJson, order: 10 },
};

const countyKeys = Object.keys(defaultCountyConfig).sort(
  (a, b) => defaultCountyConfig[a].order - defaultCountyConfig[b].order
);

export { defaultCountyConfig, countyKeys };
