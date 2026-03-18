import requests
from bs4 import BeautifulSoup

def fetch_news():
    # URL of the AI news section
    url = "https://techcrunch.com/category/artificial-intelligence/"
    
    # Headers to mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        print("Fetching latest AI news...")
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Finding news titles
        headlines = soup.find_all('h2', class_='loop-card__title')

        print("\n--- 🚀 TOP 5 AI NEWS UPDATES ---")
        for i, news in enumerate(headlines[:5], 1):
            title = news.get_text().strip()
            link = news.find('a')['href']
            print(f"{i}. {title}")
            print(f"   Link: {link}\n")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_news()
  
