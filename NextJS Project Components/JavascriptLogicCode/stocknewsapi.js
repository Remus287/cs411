/*
documentation here: https://stocknewsapi.com/documentation
examples here: https://stocknewsapi.com/examples#examples-basic

INSTRUCTIONS:

make a file named key.js
put this code in:

  const apiKey = 'YOUR_KEY_HERE';
  module.exports = apiKey;

save and close

cd to current path in terminal
terminal >> node stocknewsapi.js
DO NOT PUSH THE KEY!!!!
*/


async function getStockNewsData(stockSymbol) {
  const apiKey = require('./key');
  
  const endpoint = `https://stocknewsapi.com/api/v1?tickers=${stockSymbol}&items=100&page=1&sortby=rank&extra-fields=rankscore&token=${apiKey}`;
  const endpointResponse = await fetch(endpoint);
  const endpointData = await endpointResponse.json();

  return { data: endpointData };
}


async function getSentimentAndData(stockSymbol) {

  const result = await getStockNewsData(stockSymbol);
  const newsData = result.data.data;

  // Define a mapping for sentiment values
  const sentimentMapping = {
  'Positive': 1,
  'Neutral': 0,
  'Negative': -1
  };

  // Calculate the average sentiment score
  const totalSentiment = newsData.reduce((sum, article) => {
  const sentimentValue = sentimentMapping[article.sentiment] || 0;
  return sum + sentimentValue;
  }, 0);

  const averageSentiment = totalSentiment / newsData.length;

  // Return an object containing both average sentiment and original news data
  return {averageSentiment, newsData};
}
  



// Example usage
const stockSymbol = 'AAPL';

getSentimentAndData(stockSymbol)
  .then(result => {
    console.log('News Data:', result.newsData);
    console.log('Average Sentiment:', result.averageSentiment);
  })
  .catch(error => {
    console.error('Error:', error);
  });