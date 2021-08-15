import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { IBotClient } from '../models/botClient';
import { IGalnetArticle } from '../models/galnetArticle';
import { getValue, setValue } from '../utils/mongodb';

const GALNET_API = 'https://www.alpha-orbital.com/galnet-feed';

export const pollGalnet = async (bot: IBotClient): Promise<void> => {
  console.log('watchGalnet');
  const shouldGet = await getValue('watchGalnet');
  if (shouldGet === true) {
    const data = await getNewArticles();
    if (data && data.length > 0) {
      const channelId = await getValue<string>('galnetChannel');
      const channel = await bot.client.channels.fetch(channelId);
      if (channel && channel.isText()) {
        for (const article of data) {
          const embed = new MessageEmbed()
            .setTitle(article.title)
            .setDescription(article.content)
            .setFooter(article.date);
          await channel.send({ embeds: [embed] });
        }
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
    const updatedString = data.content
      .replace('<p>', '')
      .replace(unicodebreak, '')
      .replace('</p>', '')
      .replace(lastNewLine, '')
      .replace(newLine, '\n> ');
    return { ...data, content: updatedString };
  });

  const titles = (await getValue<string[]>('galnetTitles')) ?? [];
  if (titles) {
    const newArticles = processedData.filter(
      (x) => !titles.find((y) => y === x.title)
    );
    const newTitles = [...titles, ...newArticles.map((x) => x.title)];
    await setValue('galnetTitles', newTitles);
    return newArticles;
  }
  return undefined;
};
