
function getId()
    local id = "0";
    if fs.exists("./id.lua") then
        local fil = fs.open("./id.lua","r");
        id = fil.readLine();
    end

    return id;
end

local id = getId();
print(id.."id");
rednet.open("right");
local monitor = peripheral.wrap("back");
monitor.setTextScale(5);

while true do
    local sender, message = rednet.receive();
    local msgTable = textutils.unserializeJSON(message);
    local toId = tostring(msgTable.to);

    if toId == id then
        monitor.setCursorPos(1,1);
        monitor.write(msgTable.write);
        print("wrote "..msgTable.write);
    end
end