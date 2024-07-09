async function askQuestion() {
    const question = document.getElementById('search-input').value;
    const responseContainer = document.getElementById('content-container');

    try {
        console.log(question)
        const response = await fetch('http://127.0.0.1:5000/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({ question })
        });
        let data = await response.text();
        responseContainer.innerHTML = `<div class="col-12"><p>${data}</p></div>`;
    } catch (error) {
        console.error('Error:', error);
        responseContainer.innerHTML = `<div class="col-12"><p>Error fetching the answer.</p></div>`;
    }
}