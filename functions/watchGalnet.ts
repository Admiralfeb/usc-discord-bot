import axios from 'axios';
import { IGalnetArticle } from '../models/galnetArticle';
import { getValue } from '../utils/mongodb';

const GALNET_API =
  'https://elitedangerous-website-backend-production.elitedangerous.com/api/galnet?_format=json';

export const watchGalnet = async () => {
  console.log('watchGalnet');
  const shouldGet = await getValue('watchGalnet');
  if (shouldGet === true) {
    const data = await getNewArticles();
    if (data && data.articles.length > 0) {
      const channels = (await getValue('galnetChanels')) as string[];
      for (const channel of channels) {
      }
    } else console.log('No further articles');
  }
};

const getNewArticles = async () => {
  const response = (await axios.get<IGalnetArticle[]>(GALNET_API)).data;

  const unicodebreak = /<br \/>/g;
  const newLine = /\n/g;
  const lastNewLine = /\n$/;

  const processedData = response.map((data) => {
    const updatedString = data.body
      .replace('<p>', '')
      .replace(unicodebreak, '')
      .replace('</p>', '')
      .replace(lastNewLine, '')
      .replace(newLine, '\n> ');
    const id = parseInt(data.nid);
    return { ...data, body: updatedString, id };
  });

  const latestId = await getValue('latestGalNet');
  if (latestId) {
    const idNumber = parseInt(latestId as string);
    const newArticles = processedData.filter((x) => x.id > idNumber);
    return { articles: newArticles, currentId: idNumber };
  }
  return undefined;
};
