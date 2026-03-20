const CURRENTS_API_KEY = 'nA7FhdKRgKuB4ur7Ce77_hTt7eVLaucj-MnL22RDcU7oqn8Z'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews(category = '') {
    const userInput = document.getElementById('searchInput').value;
    // If no search, it fetches a mix of TN, India, and Global Tech news
    const query = userInput || category || 'Tamil Nadu India Technology'; 
    
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">📡 Fetching Global & Local Updates...</p>';

    try {
        // Broad search to include other states and international news
        const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${CURRENTS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
            displayNews(data.news);
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">No news found for "${query}". Try "Global".</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">📡 Satellite Connection Error. Refresh!</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Analysis pending...";
        const newsUrl = article.url;

        // Randomly assign labels for that 'Aachariya' factor
        const labels = ['JUST IN', 'GLOBAL', 'TAMIL NADU', 'TRENDING', 'TECH'];
        const randomLabel = labels[Math.floor(Math.random() * labels.length)];

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full text-left group">
                <div class="relative overflow-hidden rounded-2xl mb-4">
                    <span class="absolute top-2 left-2 bg-blue-600 text-[8px] font-black px-2 py-1 rounded-md z-10 text-white uppercase">${randomLabel}</span>
                    <img src="${article.image !== 'None' ? article.image : 'https://via.placeholder.com/400x200'}" 
                         class="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500" 
                         onerror="this.src='https://via.placeholder.com/400x200?text=Live+News'">
                </div>
                
                <h3 class="font-bold text-sm mb-3 text-white leading-snug">${article.title.slice(0, 90)}...</h3>
                
                <div class="mt-auto pt-4 border-t border-gray-800">
                    <div class="flex justify-between items-center mb-4">
                        <a href="${newsUrl}" target="_blank" class="text-blue-400 text-[10px] font-bold hover:text-white transition">SOURCE 🔗</a>
                        <div class="flex gap-3">
                            <button onclick="shareNews('whatsapp', '${cleanTitle}', '${newsUrl}')" class="opacity-70 hover:opacity-100 transition">
                                <span class="text-green-500 font-bold text-[10px]">WA</span>
                            </button>
                            <button onclick="shareNews('linkedin', '${cleanTitle}', '${newsUrl}')" class="opacity-70 hover:opacity-100 transition">
                                <span class="text-blue-500 font-bold text-[10px]">LI</span>
                            </button>
                        </div>
                    </div>
                    
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="w-full bg-white text-black py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg">
                        ⚡ AI INTELLIGENCE SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function shareNews(platform, title, url) {
    const text = encodeURIComponent(`🗞️ *AI News Alert*: ${title}\n\nRead more on my AI Reporter: `);
    let shareUrl = platform === 'whatsapp' 
        ? `https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this news clearly in 2-3 lines of Tamil. Make it sound professional: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI GLOBAL INTELLIGENCE (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) {
        alert("Gemini High-Traffic! Retry in 5s.");
    }
}

window.onload = () => fetchNews();
