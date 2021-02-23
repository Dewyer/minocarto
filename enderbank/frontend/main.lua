
local Ui = {
    askQuestion = function (question,options)
        print(question);
        for kk, vv in pair(options) do
            print("> ["..kk.."] "..vv);
        end
        local answer = nil;
        repeat
            local inp = tonumber(read());
            if inp < 0 or inp > options:getn() then
                print("Invalid option");
            else
                answer = inp;
            end
        until(!answer)

        return answer;
    end
};

local Api = {
    url = "http://enderbank.ngrok.io",
    token = nil,

    loadToken = function ()
        if !fs.exists("./token") then
            return false;
        end
        local tokFile = fs.open("./token", "r");
        local token = tokFile.readLine();
        if token:len() == 0 then
            return false;
        end

        self.token = token;
        return true;
    end

    register = function (username, password)
        print(self.url);
    end
};

function registerFlow() then
    print("You seem to be logged out.");
    local loginOrRegister = Ui.askQuestion("What to do ?", {"Login", "Register"});
    print(loginOrRegister);
end

function main()
    print("Dankyer LLC Bank wallet-app V 0.0");
    local loadedToken = Api:loadedToken();
    if loadedToken then
        print("Welcome back!");
    else
        registerFlow();
    end
end

main();