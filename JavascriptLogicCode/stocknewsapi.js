/*
documentation here: https://stocknewsapi.com/documentation
examples here: https://stocknewsapi.com/examples#examples-basic

INSTRUCTIONS:

put key in a key.js file in the same directory as this one
cd to current path in terminal
terminal >> node stocknewsapi.js
DO NOT PUSH THE KEY!!!!
*/


async function getStockNewsData(stockSymbol, date) {
  const apiKey = require('./key');
  
  const endpoint = `https://stocknewsapi.com/api/v1?tickers=${stockSymbol}&date=${date}&items=3&page=1&sortby=rank&extra-fields=rankscore&token=${apiKey}`;
  const endpointResponse = await fetch(endpoint);
  const endpointData = await endpointResponse.json();

  return { data: endpointData };
}


async function getSentimentAndData(stockSymbol, date) {

    const result = await getStockNewsData(stockSymbol, date);
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
  date = ['01152019-today', '01152019-01152019', 'today', 'yesterday', 'last7days', 'last30days', 'yeartodate'];
  
  getSentimentAndData(stockSymbol, date[4])
    .then(result => {
      console.log('Average Sentiment:', result.averageSentiment);
      console.log('News Data:', result.newsData);
    })
    .catch(error => {
      console.error('Error:', error);
    });