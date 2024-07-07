const editor = ace.edit("code-editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
  showLineNumbers: true,
  tabSize: 4,
});

document.getElementById('theme-selector').addEventListener('change', function() {
    const theme = this.value;
    editor.setTheme(theme);
});

document.getElementById("run-code").addEventListener("click", async () => {
  const code = editor.getValue();
  const outputElement = document.getElementById("output");
  const debugSuggestionsElement = document.getElementById("debug-suggestions");
  
  // Clear previous output and suggestions
  outputElement.textContent = '';
  debugSuggestionsElement.textContent = '';

  //Validate code
  if (!code.trim() || !/.*int\s+main\s*\(.*\).*/.test(code)) {
    outputElement.textContent = "😑 Can't find code. Note you must have int main() present in your code";
    return;
  }

  // Send code to server for compilation and execution
  outputElement.textContent = 'Running...';
  const response = await fetch("http://localhost:3000/run-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const result = await response.json();
  outputElement.textContent = result.output;

  // Fetch debug suggestions from MindsDB
  const suggestionsResponse = await fetch("https://api.mindsdb.com/sql/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_MINDSDB_API_KEY", // Replace with your MindsDB API key
    },
    body: JSON.stringify({
      query: `SELECT suggestion FROM debug_suggestions WHERE error_message='${result.error}'`,
    }),
  });

  const suggestionsData = await suggestionsResponse.json();
  if (suggestionsData.data.length > 0) {
    debugSuggestionsElement.textContent = suggestionsData.data
      .map((s) => s.suggestion)
      .join("\n");
  } else {
    debugSuggestionsElement.textContent = "No suggestions found.";
  }
});
