import honeycomb, { preview } from "./honeycomb";

export { preview as showPreview };

export function run({ rows, columns, profileConfig }) {
  return honeycomb({ rows, columns, profileConfig });
}
