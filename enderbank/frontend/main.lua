
local Ui = {
    askQuestion = function (question,options)
        print(question);
        for kk, vv in pairs(options) do
            print("> ["..kk.."] "..vv);
        end
        local answer = nil;
        repeat
            local inp = tonumber(read());
            if inp < 0 or inp > table.getn(options) then
                print("Invalid option");
            else
                answer = inp;
            end
        until(answer ~= nil)

        return answer;
    end
};

Api = {
    url = "http://enderbank.ngrok.io/",
    token = nil,

    getHeaders = function (self, authed)
        if authed then
            return {
                Authorization="Bearer "..self.token,
                ["Content-Type"]="application/json"
            };
        else
            return {
                ["Content-Type"]="application/json"
            };
        end
    end,

    getUrl = function (self, path)
        return self.url..path;
    end,

    request = function (self, path, authed, body, isPost)
        local inp = { url=self:getUrl(path), headers=self:getHeaders(authed) };
        if body then
            inp.body=textutils.serializeJSON(body);
        end
        local resp, errorReason = nil, nil;
        if isPost then
            resp, errorReason = http.post(inp);
        else
            resp, errorReason = http.get(inp);
        end

        if errorReason then
            print("[Post failed]"..errorReason);
            return nil;
        end

        local respJson = textutils.unserializeJSON(resp.readAll());

        return respJson;
    end,

    saveToken = function (self, tokenData)
        local tokFile = fs.open("./token", "w");
        tokFile.write(tokenData);
        self.token = tokenData;
        tokFile.close();
    end,

    loadToken = function (self)
        if not fs.exists("./token") then
            return false;
        end
        local tokFile = fs.open("./token", "r");
        local token = tokFile.readLine();
        if token:len() == 0 then
            return false;
        end
        tokFile.close();

        self.token = token;
        return true;
    end,

    auth = function (self, username, password, mode)
        local resp = self:request("api/auth/"..mode, false, {
            userName=username,
            password=password
        });

        if not resp or resp.statusCode then
            return false;
        end

        self:saveToken(resp.token);
        return true;
    end,

    getInvoices = function (self)
        return self:request("api/invoices", true, nil, false);
    end
};

function registerFlow()
    print("=========");
    print("Registering new user.");
    print("- Username:");
    local username = read();
    print("- Password:");
    local pwd = read("*");

    local didReg = Api:auth(username, pwd, "register");
    if not didReg then
        print("We couldn't register you, please try again.");
        registerFlow();
    else
        print("=========");
        print("Succesfully registered.");
    end
end

function loginFlow()
    print("=========");
    print("Logging in user");
    print("- Username:");
    local username = read();
    print("- Password:");
    local pwd = read("*");

    local didReg = Api:auth(username, pwd, "login");
    if not didReg then
        print("We couldn't log you in, please try again.");
        registerFlow();
    else
        print("=========");
        print("Succesfully logged in.");
    end
end

function unathorizedFlow()
    print("You seem to be logged out.");
    local loginOrRegister = Ui.askQuestion("What to do ?", {"Login", "Register"});
    if loginOrRegister == 1 then
        loginFlow();
    else
        registerFlow();
    end
end

function listInvoices()
    local invoices = Api:getInvoices();
    if not invoices then
        print("Couldn't list invoices.");
        return;
    end

    print("Open invoices: ");
    for kk, vv in pairs(invoices) do
        print(kk.." - "..vv.amount.."$".." ,code:"..vv.code);
    end
end

function mainOperations()
    print("^^ Welcome back! ^^");
    while true do
        print("");
        local cmd = Ui.askQuestion(">-", {"List my invoices", "Create an invoice", "Pay an invoice", "Get my balance", "Quit"});
        if cmd == 1 then
            listInvoices();
        end
        if cmd == 5 then
            break;
        end
    end
end

function main()
    print("Dankyer LLC Bank wallet-app V 0.0");
    local loadedToken = Api:loadToken();
    if loadedToken then
        mainOperations();
    else
        unathorizedFlow();
    end

    print("Good bye! ...");
end

main();