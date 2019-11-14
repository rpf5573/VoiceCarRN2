import {Parts} from './@types/index';

const teamColors = [
  '#1B378A', // 1
  '#B6171E', // 2
  '#41B33B', // 3
  '#e162dc', // 4
  '#f76904', // 5
  '#a8f908', // 6
  '#479eef', // 7
  '#F4297D', // 8
  '#1C1A25', // 9
  '#f3f3fd', // 10
  '#9C27B0', // 11
  '#607D8B', // 12
  '#795548', // 13
  '#9E9E9E', // 14
  '#00BCD4'  // 15
];

const parts: Parts = {
  HAND: {
    id: 1,
    korean: '손',
    spells: [
      {
        main: '손펴',
        col: 'hand_open',
        similar: [],
        code: 11,
        speed: 0,
        command: 'motor-6/forward/45'
      },
      {
        main: '잡아',
        col: 'hand_close',
        similar: [],
        code: 12,
        speed: 0,
        command: 'motor-6/backward/45'
      },
    ],
    stop: {
      code: 10,
      command: 'motor-6/stop'
    },
  },
  ARM: {
    id: 2,
    korean: '팔',
    spells: [
      {
        main: '팔펴',
        col: 'elbow_open',
        similar: [],
        code: 21,
        speed: 0,
        command: 'motor-5/forward/45'
      },
      {
        main: '접어',
        col: 'elbow_close',
        similar: [],
        code: 22,
        speed: 0,
        command: 'motor-5/backward/45'
      },
      {
        main: '들어',
        col: 'shoulder_open',
        similar: [],
        code: 23,
        speed: 0,
        command: 'motor-2/backward/45'
      },
      {
        main: '내려',
        col: 'shoulder_close',
        similar: [],
        code: 24,
        speed: 0,
        command: 'motor-2/forward/45'
      },
    ],
    stop: {
      code: 20,
      command: 'arm/stop'
    },
  },
  WAIST: {
    id: 3,
    korean: '몸',
    spells: [
      {
        main: '왼쪽',
        col: 'waist_left',
        similar: [],
        code: 31,
        speed: 0,
        command: 'motor-1/forward/60'
      },
      {
        main: '오른쪽',
        col: 'waist_right',
        similar: [],
        code: 32,
        speed: 0,
        command: 'motor-1/backward/60'
      }
    ],
    stop: {
      code: 30,
      command: 'motor-1/stop'
    },
  },
  BOTTOM : {
    id: 4,
    korean: '다리',
    spells: [
      {
        main: '앞으로',
        col: 'bottom_go',
        similar: [],
        code: 41,
        speed: 0, // 99가 max다 !! 100은 아니되옵니다~
        command: 'bottom/forward/100'
      },
      {
        main: '뒤로', 
        col: 'bottom_back',
        similar: [],
        code: 42,
        speed: 0,
        command: 'bottom/backward/100'
      },
      {
        main: '왼쪽',
        col: 'bottom_left',
        similar: [],
        code: 43,
        speed: 0,
        command: 'bottom/left/70'
      },
      {
        main: '오른쪽',
        col: 'bottom_right',
        similar: [],
        code: 44,
        speed: 0,
        command: 'bottom/right/70'
      },
      {
        main: '빠르게',
        col: 'bottom_go_fast',
        similar: [],
        code: 45,
        speed: 0,
        command: 'bottom/forward/100'
      },
    ],
    stop: {
      code: 40,
      command: 'bottom/stop'
    },
  }
};

enum Locale {
  en_US = 'en-US',
  ko_KR = 'ko-KR',
  ja_JP = 'ja-JP',
  zh_CN = 'zh-CN',
  zh_HK = 'zh_HK',
  zh = 'zh'
}

const rapiURL = (team: number) => {
  // return `http://localhost:8080/command`;
  return `http://voice-car-0${team}.jp.ngrok.io`;
}
const isDev = false;
const serverURL = isDev ? 'http://localhost:8080' : 'http://voice-car.club';

enum ROUTES {
  EntranceScreen = "EntranceScreen",
  PartSelectScreen = "PartSelectScreen",
  SpeechScreen = "SpeechScreen",
  RemoteControllerScreen = "RemoteControllerScreen",
  TestScreen = "TestScreen"
}
enum HaxagonViewType {
  Empty = 'empty',
  Text = 'text',
  Image = 'image'
}
enum SpeechSpellMenuButtonType {
  Empty = 'empty',
  Text = 'text'
}
enum RemoteBtnType {
  Empty = 'empty',
  Text = 'text',
  PlaceHoldImage = 'placeholdimage',
  SpeedInputButton = 'speedInputButton',
}

export {
  teamColors,
  parts,
  Locale,
  rapiURL,
  serverURL,
  ROUTES,
  HaxagonViewType,
  RemoteBtnType,
  SpeechSpellMenuButtonType,
}