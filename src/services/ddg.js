import { fetchHTML, iterateLINKS, iterateHTML } from '../helpers';

function toEscapeMSg(str) {
  return str.replace(/_/gi, '__');
  // .replace(/-/gi, "\\-")
  // .replace("~", "\\~")
  // .replace(/`/gi, "\\`")
  // .replace(/\./g, "\\.")
  // .replace(/\</g, "\\<")
  // .replace(/\>/g, "\\>");
  // .replace(/\[/g, "\\[")
  // .replace(/\]/g, "\\]");
}

// eslint-disable-next-line func-names
export default function (query) {
  const searchResult = fetchHTML(`https://html.duckduckgo.com/html?q=${query}`);

  return searchResult
    .then((result) => {
      let message = '🔍 Search results from DuckDuckGo\n\n';

      const finalResult = [];

      const title = iterateHTML(result, '.result__body > .result__title');
      const links = iterateLINKS(result, '.result__body > .result__snippet');
      const descriptions = iterateHTML(
        result,
        '.result__body > .result__snippet',
      );

      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < 10; x++) {
        const obj = {};
        obj.title = title[x].trim();
        obj.link = toEscapeMSg(links[x].trim());
        obj.description = descriptions[x].trim();

        finalResult.push(obj);
      }

      finalResult.forEach((obj) => {
        message += `[${obj.title}](${obj.link})\n${obj.description}\n\n`;
      });

      return {
        status: 'success',
        markdown: toEscapeMSg(message),
      };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.message);
      return {
        status: 'fail',
        markdown: err.message,
      };
    });
}
