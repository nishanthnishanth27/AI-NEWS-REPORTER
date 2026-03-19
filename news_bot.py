import requests
from bs4 import BeautifulSoup
import datetime

def fetch_news():
    AUTHOR_NAME = "NISHANTH"
    # English News Source
    en_url = "https://www.bbc.com/technology"
    # Tamil News Source (BBC Tamil)
    ta_url = "https://www.bbc.com/tamil"
    
    headers = {'User-Agent': 'Mozilla/5.0'}

    try:
        # Fetch English News
        en_res = requests.get(en_url, headers=headers)
        en_soup = BeautifulSoup(en_res.content, 'html.parser')
        en_headlines = en_soup.find_all(['h2', 'h3'], limit=15)

        # Fetch Tamil News
        ta_res = requests.get(ta_url, headers=headers)
        ta_soup = BeautifulSoup(ta_res.content, 'html.parser')
        ta_headlines = ta_soup.find_all(['h2', 'h3'], limit=15)

        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # --- HTML DESIGN START ---
        html_content = f"""
        <!DOCTYPE html>
        <html lang="ta">
        <head>
            <meta charset="UTF-8">
            <title>AI & Tech News - {AUTHOR_NAME}</title>
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f2f5; }}
                .card {{ max-width: 800px; margin: auto; background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
                h1 {{ color: #1a73e8; text-align: center; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; }}
                h2 {{ color: #d93025; border-left: 5px solid #d93025; padding-left: 10px; margin-top: 30px; }}
                .author-box {{ text-align: center; background: #e8f0fe; padding: 10px; border-radius: 8px; margin-bottom: 20px; }}
                .news-box {{ margin-bottom: 15px; padding: 15px; background: #fafafa; border-radius: 8px; border: 1px solid #eee; }}
                a {{ text-decoration: none; color: #1a73e8; font-weight: bold; font-size: 0.9em; }}
                .footer {{ text-align: center; margin-top: 30px; font-size: 0.8em; color: #70757a; }}
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🤖 News Reporter Bot</h1>
                <div class="author-box">
                    <p><strong>Developed by:</strong> {AUTHOR_NAME} (2nd Year AI & DS)</p>
                    <p><strong>Last Updated:</strong> {now}</p>
                </div>

                <h2>🌐 Global Tech News (English)</h2>
        """

        # Add English News
        count = 0
        for news in en_headlines:
            title = news.get_text().strip()
            link = news.find_parent('a')['href'] if news.find_parent('a') else None
            if link and len(title) > 25:
                count += 1
                if not link.startswith('http'): link = "https://www.bbc.com" + link
                html_content += f'<div class="news-box"><h3>{count}. {title}</h3><a href="{link}" target="_blank">Read More →</a></div>'
            if count == 5: break

        html_content += "<h2>📰 முக்கிய செய்திகள் (Tamil News)</h2>"

        # Add Tamil News
        ta_count = 0
        for news in ta_headlines:
            title = news.get_text().strip()
            link = news.find_parent('a')['href'] if news.find_parent('a') else None
            if link and len(title) > 20:
                ta_count += 1
                if not link.startswith('http'): link = "https://www.bbc.com" + link
                html_content += f'<div class="news-box"><h3>{ta_count}. {title}</h3><a href="{link}" target="_blank">மேலும் படிக்க →</a></div>'
            if ta_count == 5: break

        html_content += f"""
                <div class="footer">
                    &copy; 2026 {AUTHOR_NAME} | Automated Daily via GitHub Actions
                </div>
            </div>
        </body>
        </html>
        """
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(html_content)
        print("✅ Website updated with English and Tamil news!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_news()
    
