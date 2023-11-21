// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignoring TS6059 as we want to import version from package.json
import { version } from '../../package.json';

export function setVersionHeader(_, res, next) {
  res.setHeader('x-api-version', version);
  next();
}
