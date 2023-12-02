export async function getStockData(stock : String, api_key : String){
	let base_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY';
	
	let full_url = base_url + '&symbol=' + stock + '&interval=5min&apikey=' + api_key;
	
	let res = await fetch(full_url);

	return await res.json ()
}