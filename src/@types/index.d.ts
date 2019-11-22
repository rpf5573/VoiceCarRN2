import {SpeechSpellMenuButtonType, RemoteBtnType} from '../constants';

type Spell = {
  main: string,
  col: string,
  similar: string[]|null,
  code: number,
  speed: number,
  command?: string // 아직은 undefined
}
type SpellOnRemote = {
  main: string,
  active: boolean,
  command: string
}
type Part = {
  id: number,
  korean: string,
  spells: Spell[],
  stop: {
    code: number,
    command?: string
  }
}
type Parts = {
  HAND: Part,
  ARM: Part,
  WAIST: Part,
  BOTTOM: Part
}
type InitialAppState = {
  rcUsageState: boolean|null
}
type DirBtn = {
  direction: string,
  comment: string
}
type RemoteControlBtnProps = {
  type: RemoteBtnType,
  btnNumber: number,
  text?: string,
  code?: number,
  speed? : number,
  strokeColor: string,
  onPress: ((type: RemoteBtnType, text: string, btnNumber: number, code: number, speed: number) => void) | (() => void)
}
interface ISpeechScreen {
  prototype?: any;
  getMatchedSpell?: (spellWord: string) => { code: number, speed: number }
  sendCommand?: (code: number, speed: number, callback?: () => void) => void
}

export {
  Spell,
  SpellOnRemote,
  Part,
  Parts,
  InitialAppState,
  DirBtn,
  RemoteControlBtnProps,
  ISpeechScreen
}