export default function valuesList(values: Array<any>): string {
  if (values.length < 3) {
    return values.join(", ");
  }
  return `${values[0]} and ${values.length - 1} other values`;
}
