rednet.open('right');
local letters = 6;

function writeText(text)
    for i=1,text/3,1 do
        local ts = (i-1)*3 + 1;
        local msg = {
            to= i-1,
            write= word:sub(ts,ts+2),
        };
        local mjson = textutils.serializeJSON(msg);
        print(mjson);
        rednet.broadcast(mjson);
    end
end

writeText("AMAZON -FREE SHIPPING!");
