# First get the api key from mdb.ai

## create ml engine

```sql
CREATE ML_ENGINE minds_endpoint_engine
FROM minds_endpoint
USING
      minds_endpoint_api_key = 'api-key-value';
```


# Create all models by running them in mindsdb editor : 

## code helper:

```sql
CREATE MODEL code_helper
PREDICT output
USING
engine = 'minds_endpoint_engine',
max_tokens = 800,
model_name = 'mistral-7b',
prompt_template = 'You are an AI code assistant. I will provide you with a snippet of C++ code. Your task is to analyze the code and return any errors found along with suggestions to fix them. The response should be in a parsable JSON format. Ensure the JSON includes the following fields: "error" and "suggestion", and format the content within these fields using HTML.  Here is the structure of the JSON response: { "error": "<formatted_error_description>", "suggestion": "<formatted_suggestion_to_fix_error>" }  Here is the C++ code:  {{code}}';
```

## code explainer:

```sql
CREATE MODEL coding_explainer
PREDICT output
USING
  engine = 'minds_endpoint_engine',
  max_tokens = 800,
  model_name = 'mistral-7b',
  prompt_template = '
    You are an AI coding explainer. I will provide you with a coding concept. 
    Your task is to analyze the concept and return the following information: 
    - "explanation": a detailed explanation of the concept 
    - "key_points": key points about the concept 
    - "example_code": example code snippets in C++ 
    - "conclusion": a brief conclusion about the concept

    The response should use HTML formatting.

    Here is the concept: {{concept}}';
```

## code chat helper

```sql
CREATE MODEL coding_chat_helper
PREDICT output
USING
  engine = 'minds_endpoint_engine',
  max_tokens = 800,
  model_name = 'mistral-7b',
  prompt_template = '\r\n    You are an AI coding expert chatting with a coding newbie. \r\n    The user will ask questions about coding, and your task is to provide clear, concise, and helpful answers.\r\n    Ensure your responses are beginner-friendly and include examples where necessary. \r\n    The response should be in a format:\r\n    - "answer": your detailed answer, formatted using HTML\r\n    - "example_code": example code snippets in C++ if relevant to the answer\r\n\r\n    Here is an example interaction:\r\n    User: {{question}}\r\n\r\n    Response in formatted html format. Give these two as headings answer and example_code\r\n';
```

