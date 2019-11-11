declare module "react-native-voice" {
  type Locale = 'en-US' | 'ko-KR' | 'ja-JP' | 'zh-CN' | 'zh_HK' | 'zh'
  type Option = {
    EXTRA_LANGUAGE_MODEL: string,
    EXTRA_MAX_RESULTS: number,
    EXTRA_PARTIAL_RESULTS: boolean,
    REQUEST_PERMISSIONS_AUTO: boolean
  }
  type StartEvent = {
    error: boolean
  }
  type RecognizedEvent = {
    error: boolean
  }
  type EndEvent = {
    error: boolean
  }
  type ErrorEvent = {
    error: string
  }
  type Results = {
    value: [string]
  }
  type PartialResults = {
    value: [string]
  }
  function removeAllListeners(): void
  function destroy(): Promise<{}>
  function start(local: Locale, options?: Option): Promise<{}>
  function stop(): Promise<{}>
  function cancel(): Promise<{}>
  function isAvailable(): Promise<{}>
  function isRecognizing(): Promise<{}>
  function onSpeechStart(e: StartEvent): void
  function onSpeechRecognized(e: RecognizedEvent): void
  function onSpeechEnd(e: EndEvent): void
  function onSpeechError(e: ErrorEvent): void
  function onSpeechResults(e: Results): void
  function onSpeechPartialResults(e: PartialResults): void
}