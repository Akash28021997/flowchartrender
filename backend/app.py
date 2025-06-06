from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Minimal CORS configuration
CORS(app, 
     origins=["https://flow-chart-render.onrender.com"],
     allow_credentials=True,
     methods=["GET", "POST", "OPTIONS"])

@app.route('/', methods=['GET', 'POST', 'OPTIONS'])''
def process_data():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'ok'})
        return response

    if request.method == 'GET':
        return jsonify({'status': 'ok'})

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        input_data = data.get('input_data')
        ref_num = data.get('ref_num')
        
        if not input_data:
            return jsonify({"error": "Input data is required"}), 400
            
        output_data, dct = process_input_data(input_data, ref_num)
        return jsonify({"output": output_data, "dictionary": dct})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_input_data(input_data, ref_num):
    # Add input validation
    if not input_data:
        return {"error": "No input data provided"}, {}
        
    inp = input_data.split('\n')
    if not inp:  # Check if inp is empty
        return {"error": "Empty input data"}, {}
        
    try:
        if len(inp[-1]) == 1:
            # Add your existing code here
            pass  # Replace this with your actual code
    except IndexError:
        return {"error": "Invalid input format"}, {}
    
    x = len(inp) - 1
    while x >= 0:
        pointer = len(inp[x]) - 1
        if len(inp[x]) <= 3:
            inp = inp[:x] + inp[x+1:]
            x -= 1
            continue
        while pointer >= 0:
            if (ord(inp[x][pointer]) >= 32 and ord(inp[x][pointer]) <= 126) or inp[x][pointer] in ['₹', '€']:
                pass
            else:
                inp[x] = inp[x][:pointer] + inp[x][pointer+1:]
            pointer -= 1

        if inp[x].endswith(';'):
            inp[x] = inp[x][:-1]
        inp[x] = inp[x].lstrip()
        x -= 1

    dct = {}
    add = 2
    for element in inp:
        if element not in dct:
            dct[element] = ref_num + add
            add += 2

    inp = [inp[i:i+4] for i in range(0, len(inp), 4)]

    if len(inp[-1]) == 1:
        inp = inp[:-2] + [inp[-2] + inp[-1]]

    return inp, dct

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
