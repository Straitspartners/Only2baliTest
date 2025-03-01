# import requests
# from django.conf import settings


# BASE_URL = "https://api.aviationstack.com/v1/airports"
# API_KEY = settings.AVIATIONSTACK_API_KEY
# def fetch_airports(country_code):
#     """Fetch airports data from AviationStack API."""
#     url = f"{BASE_URL}?access_key={API_KEY}"
#     print(f"Requesting URL: {url}")  # Log the URL to see what's being sent

#     try:
#         response = requests.get(url)
#         print(f"Response Status: {response.status_code}")  # Log status code
        
#         if response.status_code == 200:
#             data = response.json()
#             print(f"Received data: {data}")  # Log the data to inspect it
#             airports = [
#                 {"airport_name": airport['airport_name'], "icao_code": airport['icao_code']}
#                 for airport in data.get('data', [])
#             ]
#             return airports
#         else:
#             print(f"Failed to fetch airports: {response.status_code} - {response.text}")  # Log the error
#             return []
#     except Exception as e:
#         print(f"Exception during API call: {str(e)}")  # Log any exception
#         return []


