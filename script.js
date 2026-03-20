const GNEWS_API_KEY = '3713a2237ee5e9d2812b765100a5009f'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">🤖 AI Fetching News...</p>';

    try {
        // GNews API strictly requires 'token' parameter
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&token=${GNEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">API Message: ${data.errors ? data.errors[0] : 'No news found'}</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">Network Error. Refresh page.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Summary available.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition shadow-2xl flex flex-col h-full">
                <img src="${article.image || 'https://via.placeholder.com/400x200?text=AI+News'}" class="w-full h-40 object-cover rounded-xl mb-4">
                <h3 class="font-bold text-sm mb-2 text-blue-100">${article.title.slice(0, 70)}...</h3>
                <div class="mt-auto flex justify-between items-center pt-4">
                    <a href="${article.url}" target="_blank" class="text-blue-500 text-[10px] font-bold hover:underline">Read Full</a>
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">
                        AI Summary
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
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this news in 2 short lines in Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI Summary (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) {
        alert("Gemini AI is busy! Try again in 5 seconds.");
    }
}

// Ensure first load works
window.onload = fetchNews;
