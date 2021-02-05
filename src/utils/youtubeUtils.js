import ytdl from "../lib/ytdl";

const getFirstId = (page) => {
  // let match = page.match(/(?<="url":"\/watch\?v\==?).*?(?=")/);
  let match = page.match(/watch\?v=([^";]+)/);

  if (match && match["0"]) {
    return match["0"].split("=")[1];
  }
  return null;

  //   return (match && match["0"]) || null;
};

const getAudioUrl = async (videoId) => {
  let response = await ytdl("https://youtube.com/watch?v=" + videoId, {
    filter: (format) => format.itag === 140,
  });
  return response[0].url;
};

const getFirstSearchResultId = async (query) => {
  let encodedQuery = encodeURIComponent(query);
  let url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
  let response = await fetch(url);
  let text = await response.text();
  return getFirstId(text);
};

export { getAudioUrl, getFirstSearchResultId };
