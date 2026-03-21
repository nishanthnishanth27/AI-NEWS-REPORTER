const GNEWS_API_KEY = '3713a2237ee5e9d2812b765100a5009f'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const userInput = document.getElementById('searchInput').value;
    const query = userInput || 'Technology India'; 
    const grid = document.getElementById('newsGrid');
    
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">📡 SEARCHING GLOBAL SERVERS...</p>';

    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("API Limit");

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            showSafeNews(); // API key work aagala-na dummy cards varum
        }
    } catch (error) {
        showSafeNews(); // Network error vandhalum dummy cards varum
    }
}

// College demo-la blank-ah irukka koodathunu intha backup news
function showSafeNews() {
    const grid = document.getElementById('newsGrid');
    const backupData = [
        { title: "AI Revolution in 2026: The Future of Automation", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995", description: "How AI is changing the world in 2026.", url: "#" },
        { title: "India's Tech Boom: Paavai College AI Symposium Highlights", image: "https://images.unsplash.com/photo-1518770660439-4636190af475", description: "Local students developing smart city solutions.", url: "#" }
    ];
    displayNews(backupData);
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';
    articles.forEach(article => {
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Summary available.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl shadow-2xl flex flex-col h-full text-left">
                <img src="${article.image || 'https://via.placeholder.com/400x200'}" class="w-full h-44 object-cover rounded-2xl mb-4">
                <h3 class="font-bold text-[13px] mb-3 text-white">${article.title.slice(0, 80)}...</h3>
                <div class="mt-auto pt-4 flex flex-col gap-3">
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase">
                        ✨ AI TAMIL SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize in 2 lines in Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI Summary:\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) { alert("AI Summary: Unagalukaga technology valarndhu varugirathu!"); }
}

window.onload = fetchNews;
