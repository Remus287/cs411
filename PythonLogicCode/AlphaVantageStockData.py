import requests
import json

# we kinda dont actually need a key for this

# Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
api_key = 'YOUR_API_KEY'

# Define the stock symbol (in this case, Apple)
symbol = 'AAPL'

# Define the endpoint for the Alpha Vantage API
base_url = 'https://www.alphavantage.co/query'

# Define the function to fetch stock data
def get_stock_data(symbol, api_key):
    # Define the API parameters for the time series data (you can modify these as needed)
    params = {
        'function': 'TIME_SERIES_DAILY',
        #'function': 'GLOBAL_QUOTE',
        'symbol': symbol,
        'apikey': api_key
    }

    try:
        # Send a GET request to the Alpha Vantage API
        response = requests.get(base_url, params=params)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()

            # Save the data to a JSON file
            with open('stockData.json', 'w') as json_file:
                json.dump(data, json_file, indent=4)

            #print("Stock data saved to stockData.json")
            print(data)
        else:
            print(f"Error: Unable to fetch data. Status code {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

# Call the function to get Apple stock data
get_stock_data(symbol, api_key)
