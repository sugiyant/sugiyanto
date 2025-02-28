document.addEventListener('DOMContentLoaded', () => {
    fetchQuote();
});

function fetchQuote() {
    // Ganti URL ini dengan URL API yang sesuai
    const apiUrl = 'https://api.example.com/quotes';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const quote = data.quote;
            const source = data.source;

            document.getElementById('quote').innerText = quote;
            document.getElementById('source').innerText = source;
        })
        .catch(error => console.error('Error fetching quote:', error));
}