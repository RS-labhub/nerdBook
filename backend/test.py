import mindsdb_sdk
import os
from dotenv import load_dotenv
import pandas as pd
from json import loads

load_dotenv()

server = mindsdb_sdk.connect()
project = server.get_project("mindsdb")

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


# model = project.models.get("code_helper")


# def generate(code):
#     df = pd.DataFrame(model.predict({"code": code}))
#     data = df["output"][0]
#     return data


# print(
#     generate(
#         """
# #include <iostream>

# int main() {
#     std::cout << "Hello World!";
#     return 0;
# }
#     """
#     )
# )