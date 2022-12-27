export default function debounce(
  func: (...args: Array<any>) => void,
  timeout: number
): (...args: Array<any>) => void {
  var timer: NodeJS.Timeout | undefined;
  return function (...args: Array<any>) {
    if (!timer) {
      func(...args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      func(...args);
    }, timeout);
  };
}
