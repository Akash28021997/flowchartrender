from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def process_data():
    # Initialize an empty dictionary for each request
    dct = {}

    # Retrieve input data
    input_data = request.json.get('inputString')
    ref_num = request.json.get('refNum')

    if input_data is None or ref_num is None:
        return jsonify({'message': 'Invalid input'}), 400

    try:
        ref_num = int(ref_num)
    except ValueError:
        return jsonify({'message': 'refNum must be an integer'}), 400

    # Get the page number from request args
    input_num = request.args.get('currentPage', default=1, type=int)

    # Process the input data
    output_data, dct = process_input_data(input_data, ref_num)

    total_pages = len(output_data)

    try:
        return jsonify({
            'outputString': output_data[input_num-1],
            'totalPages': total_pages,
            'ref_dict': dct
        })
    except IndexError:
        return jsonify({'message': 'Page number out of range'}), 400


def process_input_data(inp, num):
    # Split the input string by newline
    inp = inp.split('\n')

    # Clean up each line and remove unwanted characters
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

    # Link paragraphs to reference numbers
    dct = {}
    add = 2
    for element in inp:
        if element not in dct:
            dct[element] = num + add
            add += 2

    # Group the input into chunks of 4
    inp = [inp[i:i+4] for i in range(0, len(inp), 4)]

    if len(inp[-1]) == 1:
        inp = inp[:-2] + [inp[-2] + inp[-1]]

    # Add alphabets for continuation between pages
    alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for i, chunk in enumerate(inp):
        if len(inp) > 1:
            if i == 0:
                chunk.append(alpha[i % 26])
            elif i == len(inp) - 1:
                chunk.insert(0, alpha[i % 26])
            else:
                chunk.insert(0, alpha[i % 26])
                chunk.append(alpha[(i + 1) % 26])

    # Add 'Start' and 'End' markers
    if inp:
        inp[0].insert(0, 'Start')
        inp[-1].append('End')

    return inp, dct


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
