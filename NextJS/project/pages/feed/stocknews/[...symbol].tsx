//import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';


export default function Home() {
  const [apiData, setApiData] = useState(null);


  const callAPI = async () => {
    try {
      const res = await fetch(
		// need to keep key private, honestly can't figure it out
        `https://stocknewsapi.com/api/v1?tickers=AAPL&items=3&page=1&sortby=rank&extra-fields=rankscore&token=API_KEY_HERE`
      );
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Call the API when the component mounts
    callAPI();
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div>
      <main>
        {apiData && (
          <div>
            {apiData.data.map((article, index) => (
              <div key={index}>
                <h3>Title: {article.title}</h3>
                <p>Text: {article.text}</p>
                <p>Sentiment: {article.sentiment}</p>
                <p>
                  <a href={article.news_url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
