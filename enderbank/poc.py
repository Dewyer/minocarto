import hashlib

key = "d4f5gdf456g456456dfg456"

def hash(data):
    return hashlib.sha224(data.encode()).hexdigest()

def getNote(id, am):
    cc = str(id) + "-"+ str(am)
    return cc+"---"+hash(cc)

notes = [
    [4, 10],
    [8, 10], 
    [16, 10],
    [32, 10],
    [64, 10],
    [128, 10],
    [256, 10]
]

code = """
local pp = peripheral.wrap("left");

"""
cid = 35

for nn in notes:
    for ii in range(nn[1]):
        cid += 1
        code += "pp.newPage();\n"
        code += "pp.setPageTitle(\""+str(nn[0])+"$\");\n"
        code += "pp.write(\""+getNote(cid, nn[0])+"\");\n"
        code += "pp.endPage();\n"
        code += "os.sleep(1);\n"

print(code)