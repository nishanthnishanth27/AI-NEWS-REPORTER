import requests
from bs4 import BeautifulSoup
import datetime

def fetch_news():
    AUTHOR_NAME = "NISHANTH"
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ta">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI & Tech News - {AUTHOR_NAME}</title>
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f2f5; }}
            .card {{ max-width: 800px; margin: auto; background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
            h1 {{ color: #1a73e8; text-align: center; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; }}
            h2 {{ color: #d93025; border-left: 5px solid #d93025; padding-left: 10px; margin-top: 30px; background: #fff5f5; padding: 10px; border-radius: 5px; }}
            .author-box {{ text-align: center; background: #e8f0fe; padding: 10px; border-radius: 8px; margin-bottom: 20px; }}
            .news-box {{ margin-bottom: 15px; padding: 15px; background: #fafafa; border-radius: 8px; border: 1px solid #eee; }}
            .news-box h3 {{ margin: 0 0 10px 0; font-size: 1.1em; color: #202124; line-height: 1.4; }}
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

    # --- 1. GLOBAL NEWS (BBC) ---
    try:
        html_content += "<h2>🌐 Global Tech News (English)</h2>"
        res = requests.get("https://www.bbc.com/technology", headers=headers, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        found = 0
        for item in soup.find_all(['h2', 'h3']):
            title = item.get_text().strip()
            anchor = item.find_parent('a') or item.find('a')
            if anchor and len(title) > 25:
                link = anchor['href']
                if not link.startswith('http'): link = "https://www.bbc.com" + link
                found += 1
                html_content += f'<div class="news-box"><h3>{found}. {title}</h3><a href="{link}" target="_blank">Read Full Article →</a></div>'
            if found == 5: break
    except: pass

    # --- 2. PUTHIYA THALAIMURAI ---
    try:
        html_content += "<h2>🔥 Puthiya Thalaimurai (Tamil News)</h2>"
        res = requests.get("https://www.puthiyathalaimurai.com/tamilnadu", headers=headers, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        found = 0
        for a in soup.find_all('a', href=True):
            title = a.get_text().strip()
            if len(title) > 35 and "/tamilnadu/" in a['href']:
                link = a['href']
                if not link.startswith('http'): link = "https://www.puthiyathalaimurai.com" + link
                found += 1
                html_content += f'<div class="news-box"><h3>{found}. {title}</h3><a href="{link}" target="_blank">முழு செய்தியைப் படிக்க →</a></div>'
            if found == 5: break
    except: pass

    # --- 3. POLIMER NEWS (FIXED LOGIC) ---
    try:
        html_content += "<h2>📺 Polimer News (Tamil News)</h2>"
        res = requests.get("https://www.polimernews.com/category/tamilnadu", headers=headers, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        found = 0
        
        # Polimer stores news inside specific div classes
        cards = soup.find_all('div', class_='category-news-content')
        if not cards:
            # Alternate search if class name changed
            cards = soup.find_all(['h4', 'h5'])

        for card in cards:
            anchor = card.find('a') if card.name != 'a' else card
            title = card.get_text().strip()
            if anchor and anchor.has_attr('href') and len(title) > 25:
                link = anchor['href']
                if not link.startswith('http'): link = "https://www.polimernews.com" + link
                found += 1
                html_content += f'<div class="news-box"><h3>{found}. {title}</h3><a href="{link}" target="_blank">முழு செய்தியைப் படிக்க →</a></div>'
            if found == 5: break
    except: pass

    html_content += f"""
            <div class="footer">&copy; 2026 {AUTHOR_NAME} | Automated Daily via GitHub Actions</div>
        </div>
    </body>
    </html>
    """
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("✅ All Sections Updated!")

if __name__ == "__main__":
    fetch_news()
    
