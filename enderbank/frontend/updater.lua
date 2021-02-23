
local mainUrl = "https://raw.githubusercontent.com/Dewyer/minocarto/master/enderbank/frontend/main.lua";
local toWrite = "./main.lua";

local mainCode = http.get(mainUrl).readAll();
print("Got main code "..mainCode:len().." bytes");

local mainToWrite = fs.open(toWrite, "w");
mainToWrite.write(mainCode);
mainToWrite.close();
print("Installed..!");