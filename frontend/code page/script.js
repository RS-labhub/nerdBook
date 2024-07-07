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

document.getElementById('theme-selector').addEventListener('change', function () {
  const theme = this.value;
  editor.setTheme(theme);
});

document.getElementById("run-code").addEventListener("click", async (event) => {
  event.preventDefault();
  // event.stopImmediatePropagation();
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
  try {
    const response = await fetch('http://localhost:3000/run-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    const result = await response.json();
    outputElement.textContent = result.output || "No output returned.";

    console.log('MindsDB Result:', result);

    // Handle the debug suggestions from MindsDB result here
    const debugSuggestionsElement = document.getElementById('debug-suggestions');
    if (result && result.data && result.data.length > 0) {
      debugSuggestionsElement.textContent = result.data[0].suggestion;
    } else {
      debugSuggestionsElement.textContent = 'No debug suggestions available.';
    }
  } catch (error) {
    console.error('Error running code:', error);
    outputElement.textContent = 'Error running code. Please try again later.';
  }
  return false;
});
