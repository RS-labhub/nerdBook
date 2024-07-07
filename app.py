import mindsdb_sdk
from dotenv import load_dotenv
import pandas as pd
from json import loads

load_dotenv()

server = mindsdb_sdk.connect()
project = server.get_project("mindsdb")

model = project.models.get("code_helper")


def generate(code):
    df = pd.DataFrame(model.predict({"code": code}))
    data = df["output"][0]
    return data


print(
    generate(
        """
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}
    """
    )
)