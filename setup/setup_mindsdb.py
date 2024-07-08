import mindsdb_sdk
import os
from dotenv import load_dotenv
import pandas as pd
from json import loads

load_dotenv()

import mindsdb_sdk
import os
from dotenv import load_dotenv

load_dotenv()

server = mindsdb_sdk.connect()

'''
CREATE ML_ENGINE minds_endpoint_engine
FROM minds_endpoint
USING
minds_endpoint_api_key = 'api-key-value';

Create ml engine with this sql command in mindsdb editor at url http://127.0.0.1:47334
'''

project = server.create_project("nerd_book")
project = server.get_project("nerd_book")


project.models.create(
name="code_helper",
predict="output",
engine="minds_endpoint_engine",
max_tokens=800,
model_name="mistral-7b",
prompt_template='''
You are an AI code assistant. I will provide you with a snippet of C++ code. Your task is to analyze the code and return any errors found along with suggestions to fix them. The response should be in a parsable JSON format. Ensure the JSON includes the following fields: "error" and "suggestion", and format the content within these fields using HTML.

Here is the structure of the JSON response:
{
"error": "<formatted_error_description>",
"suggestion": "<formatted_suggestion_to_fix_error>"
}

Here is the C++ code:

{{code}}
''',
)

project.models.create(
name="coding_chat_helper",
predict="output",
engine="minds_endpoint_engine",
max_tokens=800,
model_name="mistral-7b",
prompt_template='''You are an AI coding expert chatting with a coding newbie. The user will ask questions about coding, and your task is to provide clear, concise, and helpful answers.Ensure your responses are beginner-friendly and include examples where necessary. The response should be in a parsable JSON format with the following fields:
- "question": the user\'s question
- "answer": your detailed answer, formatted using HTML
- "example_code": example code snippets in C++ if relevant to the answer

Here is an example interaction:
User: {{question}}

Response in JSON format:
{
"question": "{{question}}",
"answer": "<formatted_answer>",
"example_code": "<formatted_example_code_if_applicable>"
}
''',
)


project.models.create(
name="coding_explainer",
predict="output",
engine="minds_endpoint_engine",
max_tokens=800,
model_name="mistral-7b",
prompt_template='''
You are an AI coding explainer. I will provide you with a coding concept.
Your task is to analyze the concept and return the following information in a parsable JSON format:
- "explanation": a detailed explanation of the concept
- "key_points": key points about the concept
- "example_code": example code snippets in C++
- "conclusion": a brief conclusion about the concept

The response should be formatted as JSON and each field should use HTML formatting.

Here is the structure of the JSON response:
{
"explanation": "<formatted_explanation>",
"key_points": "<formatted_key_points>",
"example_code": "<formatted_example_code>",
"conclusion": "<formatted_conclusion>"
}

Here is the concept: {{concept}}
''',
)