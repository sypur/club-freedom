import { useSyncExternalStore } from "react";

const mobileRegex = /iphone|ipad|ipod|android|windows phone/i;
const subscribe = () => () => {};
const getSnapshot = () => mobileRegex.test(navigator.userAgent);
const getServerSnapshot = () => false;

export default function useMobileDetect() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
