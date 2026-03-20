const GNEWS_API_KEY = '3713a2237ee5e9d2812b765100a5009f'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const userInput = document.getElementById('searchInput').value;
    // Default-ah India news load aagum
    const query = userInput || 'India'; 
    
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono text-sm">📡 CONNECTING TO G-SERVER... FETCHING LIVE FEED...</p>';

    try {
        // GNews API URL with your key
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            grid.innerHTML = `<p class="text-yellow-500 text-center col-span-full italic">No live news found for "${query}". Try searching "Global" or "Tech".</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full font-bold">⚠️ NETWORK ERROR. PLEASE REFRESH.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Summary available.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full text-left group">
                <div class="relative overflow-hidden rounded-2xl mb-4">
                    <img src="${article.image || 'https://via.placeholder.com/400x200?text=AI+News'}" 
                         class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" 
                         onerror="this.src='https://via.placeholder.com/400x200'">
                </div>
                
                <h3 class="font-bold text-[13px] mb-3 text-white leading-tight">${article.title.slice(0, 85)}...</h3>
                
                <div class="mt-auto pt-4 border-t border-gray-800">
                    <div class="flex justify-between items-center mb-4 px-2">
                        <a href="${article.url}" target="_blank" class="text-blue-400 text-[10px] font-black hover:underline uppercase">Source</a>
                        <button onclick="shareNews('whatsapp', '${cleanTitle}', '${article.url}')" class="text-green-500 text-[10px] font-bold">SHARE</button>
                    </div>
                    
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg">
                        ✨ AI TAMIL SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function shareNews(platform, title, url) {
    const text = encodeURIComponent(`🗞️ AI News: ${title}\n\nView more on my AI Reporter: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`, '_blank');
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this in 2 lines of clear Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI Summary:\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) {
        alert("AI is busy, please try again!");
    }
}

window.onload = fetchNews;
setInterval(fetchNews, 900000); // 15 mins auto-update
