import requests
from keys import NEWS_API_KEY # keys.py holds all api keys, make your own for testing

api_key = NEWS_API_KEY

# Define the API endpoint and parameters
endpoint = 'https://newsapi.org/v2/everything'
query = 'Google Stock Price'
date_from = '2023-10-10T00:00:00'  # Set the 'from' date to include articles from the 10th
date_to = '2022-10-10T00:00:00'    # Set the 'to' date to exclude articles from the 11th
page_size = 5  # Set the number of results per page (e.g., 10)

parameters = {
    'q': query,
    'apiKey': api_key,
    'from': date_from,
    'to': date_to,
    'pageSize': page_size
}

# Send a GET request to the News API
response = requests.get(endpoint, params=parameters)

# Check the status code and print the results
if response.status_code == 200:
    data = response.json()
    articles = data['articles']
    for index, article in enumerate(articles, 1):
        print(f"Article {index}:")
        print(f"Title: {article['title']}")
        print(f"Published At: {article['publishedAt']}")
        #print(f"Source: {article['source']['name']}")
        print(f"Description: {article['description']}")
        #print(f"URL: {article['url']}")
        print("------")
else:
    print(f"Error: Unable to fetch news. Status code {response.status_code}")
