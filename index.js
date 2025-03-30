document.addEventListener("DOMContentLoaded", function() {
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    const quoteText = document.getElementById('quote');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const cartItems = document.getElementById('cartItems');

    let currentQuote = "";
    let likedQuotes = [];

    // Fallback quotes in case API fails
    const fallbackQuotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Life is what happens when you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
    ];

    // Using Quotable API with proper endpoint
    const apiUrl = 'https://api.quotable.io/random';

    async function fetchQuote() {
        try {
            // Show loading state
            quoteText.textContent = "Loading quote...";
            getQuoteBtn.disabled = true;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            currentQuote = `${data.content} - ${data.author}`;
            quoteText.textContent = currentQuote;
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            // Use a random fallback quote
            currentQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteText.textContent = currentQuote;
        } finally {
            // Always enable buttons
            likeBtn.disabled = false;
            dislikeBtn.disabled = false;
            getQuoteBtn.disabled = false;
        }
    }

    const handleLike = () => {
        likedQuotes.push({ quote: currentQuote, liked: true });
        updateCart();
    };

    const handleDislike = () => {
        likedQuotes.push({ quote: currentQuote, liked: false });
        updateCart();
    };

    getQuoteBtn.addEventListener('click', fetchQuote);
    likeBtn.addEventListener('click', handleLike);
    dislikeBtn.addEventListener('click', handleDislike);

    const updateCart = () => {
        cartItems.innerHTML = '';
        likedQuotes.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('quote');
            div.innerHTML = `${item.quote} <strong>${item.liked ? 'Liked' : 'Disliked'}</strong>`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteQuote(index));
            div.appendChild(deleteButton);

            cartItems.appendChild(div);
        });
    };

    const deleteQuote = (index) => {
        likedQuotes.splice(index, 1);
        updateCart();
    };

    // Fetch first quote
    fetchQuote();
});