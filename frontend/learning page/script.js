async function askQuestion() {
    const question = document.getElementById('search-input').value;
    const responseContainer = document.getElementById('content-container');

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        responseContainer.innerHTML = `
            <div class="col-12">
                <h3>Question: ${data.question}</h3>
                <p>${data.answer}</p>
                <pre><code>${data.example_code}</code></pre>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        responseContainer.innerHTML = `<div class="col-12"><p>Error fetching the answer.</p></div>`;
    }
}