import requests
from bs4 import BeautifulSoup
import datetime

def fetch_news():
    AUTHOR_NAME = "NISHANTH"
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    headers = {'User-Agent': 'Mozilla/5.0'}

    # HTML Header & Style
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
            h2 {{ color: #d93025; border-left: 5px solid #d93025; padding-left: 10px; margin-top: 30px; background: #fff5f5; padding: 5px 10px; }}
            .author-box {{ text-align: center; background: #e8f0fe; padding: 10px; border-radius: 8px; margin-bottom: 20px; }}
            .news-box {{ margin-bottom: 15px; padding: 15px; background: #fafafa; border-radius: 8px; border: 1px solid #eee; }}
            a {{ text-decoration: none; color: #1a73e8; font-weight: bold; font-size: 0.9em; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 0.8em; color: #70757a; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🤖 AI News Reporter</h1>
            <div class="author-box">
                <p><strong>Developed by:</strong> {AUTHOR_NAME} (2nd Year AI & DS)</p>
                <p><strong>Last Updated:</strong> {now}</p>
            </div>
    """

    # --- 1. ENGLISH TECH NEWS ---
    try:
        html_content += "<h2>🌐 Global Tech News (English)</h2>"
        en_res = requests.get("https://www.bbc.com/technology", headers=headers)
        en_soup = BeautifulSoup(en_res.content, 'html.parser')
        en_headlines = en_soup.find_all(['h2', 'h3'], limit=10)
        count = 0
        for news in en_headlines:
            title = news.get_text().strip()
            link = news.find_parent('a')['href'] if news.find_parent('a') else None
            if link and len(title) > 20:
                count += 1
                if not link.startswith('http'): link = "https://www.bbc.com" + link
                html_content += f'<div class="news-box"><h3>{count}. {title}</h3><a href="{link}" target="_blank">Read More →</a></div>'
            if count == 5: break
    except: pass

    # --- 2. PUTHIYA THALAIMURAI ---
    try:
        html_content += "<h2>🔥 Puthiya Thalaimurai Headlines</h2>"
        pt_res = requests.get("https://www.puthiyathalaimurai.com/tamilnadu", headers=headers)
        pt_soup = BeautifulSoup(pt_res.content, 'html.parser')
        pt_headlines = pt_soup.find_all(['h2', 'h3'], limit=10)
        count = 0
        for news in pt_headlines:
            title = news.get_text().strip()
            link = news.find_parent('a')['href'] if news.find_parent('a') else None
            if link and len(title) > 20:
                count += 1
                if not link.startswith('http'): link = "https://www.puthiyathalaimurai.com" + link
                html_content += f'<div class="news-box"><h3>{count}. {title}</h3><a href="{link}" target="_blank">மேலும் படிக்க →</a></div>'
            if count == 5: break
    except: pass

    # --- 3. POLIMER NEWS ---
    try:
        html_content += "<h2>📺 Polimer News Headlines</h2>"
        pl_res = requests.get("https://www.polimernews.com/category/tamilnadu", headers=headers)
        pl_soup = BeautifulSoup(pl_res.content, 'html.parser')
        pl_headlines = pl_soup.find_all('h4', limit=10) # Polimer uses h4 for headlines
        count = 0
        for news in pl_headlines:
            title = news.get_text().strip()
            link = news.find_parent('a')['href'] if news.find_parent('a') else None
            if link and len(title) > 20:
                count += 1
                if not link.startswith('http'): link = "https://www.polimernews.com" + link
                html_content += f'<div class="news-box"><h3>{count}. {title}</h3><a href="{link}" target="_blank">மேலும் படிக்க →</a></div>'
            if count == 5: break
    except: pass

    html_content += f"""
            <div class="footer">&copy; 2026 {AUTHOR_NAME} | Automated Daily via GitHub Actions</div>
        </div>
    </body>
    </html>
    """
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("✅ Website updated successfully!")

if __name__ == "__main__":
    fetch_news()
    
