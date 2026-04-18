import json
with open(r'd:\Hahaton\frontend\public\Хакатон.ipynb', encoding='utf-8') as f:
    nb = json.load(f)
with open(r'd:\Hahaton\nb_output.txt', 'w', encoding='utf-8') as out:
    for i, c in enumerate(nb['cells']):
        ct = c['cell_type']
        src = ''.join(c['source'])
        out.write(f'=== CELL {i} ({ct}) ===\n')
        out.write(src)
        out.write('\n\n')
print('Done')
