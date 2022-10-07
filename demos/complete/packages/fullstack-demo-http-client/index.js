import jsonic from 'jsonic';
import fetch from 'isomorphic-fetch';
import { highlight } from 'cardinal';
import chalk from 'chalk';

const [method, url, ...rest] = process.argv.slice(2);
const body =
  method === 'POST'
    ? JSON.stringify(jsonic(Array.isArray(rest) ? rest.join(' ') : rest))
    : undefined;

const formatResHeaders = ({ headers }) => `${chalk.magenta(
  'Date: '
)} ${headers.get('date')}
${chalk.magenta('Content-Type: ')} ${headers.get('content-type')}
${chalk.magenta('Content-Length: ')} ${headers.get('content-length')}`;
const formatStatus = ({ status, statusText }) =>
  `${chalk.cyan(status)} - ${chalk.yellow(statusText)}`;

fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
  .then(res => {
    if (!res.ok) {
      console.error(`${chalk.red('HTTP ERROR: ')} ${formatStatus(res)}

${formatResHeaders(res)}`);
      process.exit(0);
    }
    return res;
  })
  .catch(err => {
    console.error(`${chalk.red('FETCH ERROR: ')}: ${err}`);
    process.exit(0);
  })
  .then(res => {
    console.log(`${formatStatus(res)}

${formatResHeaders(res)}`);
    return res;
  })
  .then(res => {
    if (res.status !== 204 && res.headers.get('content-length') > 0) {
      if (
        res.headers
          .get('content-type')
          .toLowerCase()
          .startsWith('application/json')
      )
        // we convert back and forth to be sure things are valid
        return res
          .json()
          .then(json => JSON.stringify(json, null, 2))
          .then(text => highlight(text));
      else return res.text();
    }
  })
  .then(text => {
    if (text)
      console.log(`
${text}`);
  });
