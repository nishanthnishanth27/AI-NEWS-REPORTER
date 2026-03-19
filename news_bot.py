import requests
from bs4 import BeautifulSoup
import datetime

def fetch_news():
    AUTHOR_NAME = "NISHANTH"
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

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

    # 1. GLOBAL TECH NEWS (BBC)
    try:
        html_content += "<h2>
        
