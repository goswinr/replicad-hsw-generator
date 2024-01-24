import honeycomb, { preview } from "./honeycomb";

export { preview as showPreview };

export function run({ rows, columns }) {
  return honeycomb({ rows, columns });
}
