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

// same county can have multiple name
const defaultCountyConfig = {
  changhua: { name: ['彰化縣'], geojson: ChanghuaGeoJson },
  chiayi: { name: ['嘉義縣'], geojson: ChiayiGeoJson },
  chiayicity: { name: ['嘉義市'], geojson: ChiayiCityGeoJson },
  hsinchu: { name: ['新竹縣'], geojson: HsinchuGeoJson },
  hsinchucity: { name: ['新竹市'], geojson: HsinchuCityGeoJson },
  hualien: { name: ['花蓮縣'], geojson: HualienGeoJson },
  kaohsiung: { name: ['高雄市', '高雄縣'], geojson: KaohsiungGeoJson },
  keelung: { name: ['基隆市'], geojson: KeelungGeoJson },
  kinmen: { name: ['金門縣'], geojson: KinmenGeoJson },
  lienchiang: { name: ['連江縣'], geojson: LienchiangGeoJson },
  miaoli: { name: ['苗栗縣'], geojson: MiaoliGeoJson },
  nantou: { name: ['南投縣'], geojson: NantouGeoJson },
  newtaipei: { name: ['新北市', '台北縣', '臺北縣'], geojson: NewTaipeiGeoJson },
  penghu: { name: ['澎湖縣'], geojson: PenghuGeoJson },
  pingtung: { name: ['屏東縣'], geojson: PingtungGeoJson },
  taichung: { name: ['台中市', '臺中市', '台中縣', '臺中縣'], geojson: TaichungGeoJson },
  tainan: { name: ['台南市', '臺南市', '台南縣', '臺南縣'], geojson: TainanGeoJson },
  taipei: { name: ['台北市', '臺北市'], geojson: TaipeiGeoJson },
  taitung: { name: ['台東縣', '臺東縣', '台東市'], geojson: TaitungGeoJson },
  taoyuan: { name: ['桃園縣', '桃園市'], geojson: TaoyuanGeoJson },
  yilan: { name: ['宜蘭縣'], geojson: YilanGeoJson },
  yunlin: { name: ['雲林縣'], geojson: YunlinGeoJson },
};

const countyKeys = Object.keys(defaultCountyConfig);

export { defaultCountyConfig, countyKeys };
