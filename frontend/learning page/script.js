document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const booksContainer = document.getElementById('content-container');

    searchBar.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchBar.value.trim();
            fetchBooks(query);
        }
    });

    async function getCodingResponse() {
        const query = document.getElementById('search-input').value;

        const response = await fetch('http://localhost:47334/api/sql/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer API_KEY'
            },
            body: JSON.stringify({
                "query": `SELECT explanation, key_points, code_examples, conclusion FROM coding_gpt WHERE query = '${query}'`
            })
        });

        const data = await response.json();
        displayResponse(data);
    }

    function displayResponse(data) {
        const container = document.getElementById('content-container');
        const response = data[0].query_response;

        container.innerHTML = `
            <div class="col-12">
                <h2>Explanation</h2>
                <p>${response.explanation}</p>
                <h2>Key Points</h2>
                <ul>
                    ${response.key_points.split(',').map(point => `<li>${point}</li>`).join('')}
                </ul>
                <h2>Code Examples</h2>
                <pre>${response.code_examples}</pre>
                <h2>Conclusion</h2>
                <p>${response.conclusion}</p>
            </div>
        `;
    }
})