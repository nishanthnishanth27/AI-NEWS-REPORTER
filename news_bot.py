import requests
from bs4 import BeautifulSoup

def fetch_news():
    # Using a different source (BBC Technology) for more stability
    url = "https://www.bbc.com/technology"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    }

    try:
        print("Connecting to news source...")
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Finding headlines
        headlines = soup.find_all(['h2', 'h3'], limit=10)

        print("\n--- 🚀 LATEST TECHNOLOGY UPDATES ---")
        count = 0
        for news in headlines:
            title = news.get_text().strip()
            # Link check
            parent_a = news.find_parent('a') or news.find('a')
            if parent_a and len(title) > 10:
                count += 1
                link = parent_a['href']
                if not link.startswith('http'):
                    link = "https://www.bbc.com" + link
                print(f"{count}. {title}")
                print(f"   🔗 Link: {link}\n")
            if count == 5: break
            
        if count == 0:
            print("No news items found. Website structure might have changed.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_news()
    
