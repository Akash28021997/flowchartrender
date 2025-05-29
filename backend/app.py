from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://flow-chart-render.onrender.com/"}})

@app.route('/', methods=['POST'])
def process_data():
    input_data = request.json.get('inputString')
    ref_num = request.json.get('refNum')

    if input_data is None or ref_num is None:
        return jsonify({'message': 'Invalid input'}), 400

    try:
        ref_num = int(ref_num)
    except ValueError:
        return jsonify({'message': 'refNum must be an integer'}), 400

    input_num = request.args.get('currentPage', default=1, type=int)
    output_data, dct = process_input_data(input_data, ref_num)
    total_pages = len(output_data)

    if input_num < 1 or input_num > total_pages:
        return jsonify({'message': 'Page number out of range'}), 400

    page_output = output_data[input_num - 1].copy()
    alphabet_markers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    # Logic for setting continuity markers on each page
    if input_num == 1:
    # First page: start with 'Start'
        page_output.insert(0, 'Start')
        if total_pages > 1:
            page_output.append(alphabet_markers[0])  # End with "A" for multi-page scenarios
        else:
            page_output.append('End')  # End with "End" for single-page scenarios
    elif input_num == total_pages:
    # Last page: start with previous marker and end with 'End'
        page_output.insert(0, alphabet_markers[input_num - 2])  # Start with the previous marker
        page_output.append('End')
    else:
    # Middle pages: start with previous marker and end with next marker
        page_output.insert(0, alphabet_markers[input_num - 2])  # Start with previous marker
        page_output.append(alphabet_markers[input_num - 1])      # End with next marker

    # Debug statement to track the output for each page
    print(f"Page {input_num}: {page_output}")

    return jsonify({
        'outputString': page_output,
        'totalPages': total_pages,
        'ref_dict': dct
    })

def process_input_data(inp, num):
    inp = inp.split('\n')

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
            dct[element] = num + add
            add += 2

    inp = [inp[i:i+4] for i in range(0, len(inp), 4)]

    if len(inp[-1]) == 1:
        inp = inp[:-2] + [inp[-2] + inp[-1]]

    return inp, dct

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
