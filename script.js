const CURRENTS_API_KEY = 'nA7FhdKRgKuB4ur7Ce77_hTt7eVLaucj-MnL22RDcU7oqn8Z'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">🤖 AI Fetching Live News...</p>';

    try {
        // Currents API integration
        const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${CURRENTS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
            displayNews(data.news);
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">No news found. Try searching for "Tech" or "Space".</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">Connection Error. Please refresh the page.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        // Data cleaning for Gemini summary button
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "Click for AI Summary.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition shadow-2xl flex flex-col h-full text-left">
                <img src="${article.image !== 'None' ? article.image : 'https://via.placeholder.com/400x200?text=News+Image'}" 
                     class="w-full h-40 object-cover rounded-xl mb-4" 
                     onerror="this.src='https://via.placeholder.com/400x200?text=AI+News'">
                <h3 class="font-bold text-sm mb-2 text-blue-100">${article.title.slice(0, 80)}...</h3>
                <div class="mt-auto flex justify-between items-center pt-4">
                    <a href="${article.url}" target="_blank" class="text-blue-500 text-[10px] font-bold hover:underline">Full Article</a>
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
        const summary = data.candidates[0].content.parts[0].text;
        alert("🤖 AI News Summary (Tamil):\n\n" + summary);
    } catch (e) {
        alert("Gemini AI is taking a nap! Try again in 10 seconds.");
    }
}

// Auto-load news on start
window.onload = fetchNews;
