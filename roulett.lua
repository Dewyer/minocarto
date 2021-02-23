local monitor = peripheral.wrap("back");
monitor.setTextScale(5);
local monWidth, monHeight = monitor.getSize();

function writeNum(num)
    monitor.clear();
    monitor.setCursorPos(monWidth/2+1, monHeight/2+1);
    monitor.write(tostring(num));
end

function displayRoll(roll)
    monitor.clear();
    monitor.setCursorPos(monWidth/2+1, monHeight/2+1);
    for i=0, 2 do
        monitor.write(".");
        sleep(1);
    end

    writeNum(roll);
end

displayRoll(math.random(0,35));