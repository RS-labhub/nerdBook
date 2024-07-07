from flask import Flask, request, jsonify
import mindsdb_sdk

app = Flask(__name__)


mdb = mindsdb_sdk.connect()

# Endpoint to handle MindsDB query
@app.route('/get-debug-suggestions', methods=['POST'])
def get_debug_suggestions():
    try:
        data = request.get_json()
        code_snippet = data['code']
        
        mdb.learn(from_data='debug_suggestions.csv', to_predict='suggestion')
        result = mdb.predict(predict='suggestion', when={'code_snippet': code_snippet})

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
