const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk'; // Verify your key

async function FetchNews() {
    const userInput = document.getElementById('searchInput').value;
    const query = userInput || 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono text-sm">🚀 BOOTING AI ENGINE...</p>';

    try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const finalUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(finalUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            displayNews(data.items);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No news found. Try another topic.</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full">⚠️ CONNECTION BUSY. CLICK SEARCH AGAIN.</p>';
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const title = article.title.split(' - ')[0];
        const description = article.description.replace(/<[^>]*>?/gm, '').slice(0, 100);
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl group">
                <div class="relative overflow-hidden rounded-2xl mb-4 text-center">
                    <img src="${article.thumbnail || 'https://via.placeholder.com/400x200?text=AI+News+Reporter'}" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <h3 class="font-bold text-[13px] mb-3 text-white leading-tight">${title.slice(0, 85)}...</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-2">
                        <a href="${article.link}" target="_blank" class="text-blue-400 text-[10px] font-black hover:underline uppercase tracking-widest">READ SOURCE</a>
                        <button onclick="shareNews('${title.replace(/'/g, "")}', '${article.link}')" class="text-green-500 text-[10px] font-bold">SHARE WA</button>
                    </div>
                    <button onclick="getAISummary('${title.replace(/'/g, "")}', '${description.replace(/'/g, "")}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "🤖 AI IS THINKING...";
    btn.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Summarize this in 2 short lines in Tamil: ${title}. ${desc}` }] }]
            })
        });
        const data = await response.json();
        if (data.candidates) {
            alert("🤖 AI Summary (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
        } else {
            alert("AI is busy. Please try again!");
        }
    } catch (e) {
        alert("Connection Error!");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function shareNews(title, url) {
    const text = encodeURIComponent(`🗞️ AI News: ${title}\n\nLink: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`, '_blank');
}

window.onload = FetchNews;
