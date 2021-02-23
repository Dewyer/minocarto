
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
    end,
    getNumber = function (question)
        print("- "..question..":")
        local nn = tonumber(read());
        if nn == nil then
            print("Didn't enter a number.")
            return;
        end
        return nn;
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
        if isPost == nil or isPost then
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
    end,

    createInvoice = function (self, am)
        return self:request("api/invoices/create", true, {
            amount=am,
        });
    end,

    queryInvoice = function (self, code)
        return self:request("api/invoices/query", true, {
            invoiceCode=code,
        });
    end,

    payInvoice = function (self, code)
        return self:request("api/invoices/pay", true, {
            invoiceCode=code,
        });
    end,

    getMe = function (self)
        return self:request("api/auth/me", true, nil, false);
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

function createInvoice()
    print("Creating new invoice: ");
    local am = Ui.getNumber("Amount");
    if am == nil then
        return;
    end

    local resp = Api:createInvoice(am);
    if resp.invoice then
        print("Invoice created with code:"..resp.invoice.code);
    else
        print("Failed to create invoice.");
    end
end

function viewBalance()
    print("User info:")
    local user = Api:getMe();
    if not user then
        print("Failed to get user info");
    end

    print("User: "..user.userName);
    print("Balance: "..user.balance.."$");
end

function payInvoice()
    print("Paying invoice:");
    print("- Code:");
    local code = read();
    local me = Api:getMe();
    local qry = Api:queryInvoice(code);
    if not qry.invoice then
        print("Invoice with code doesn't exists");
    end
    print("===");
    print("Owner: "..qry.owner);
    print("Amount: "..qry.invoice.amount.."$");
    print("Your balance: "..me.balance.."$");
    if me.balance < qry.invoice.amount then
        print("You don't have enough money to pay this!");
        return;
    end

    local wantsPay = Ui.askQuestion("Do you want to pay this?", {"Yes", "No"});
    if wantsPay ~= 1 then
        return;
    end

    local paid = Api:payInvoice(code);
    if paid then
        print("-Invoice paid!");
    else
        print("Couldn't pay invoice!");
    end
end

function mainOperations()
    print("^^ Welcome back! ^^");
    while true do
        print("");
        local cmd = Ui.askQuestion(">-", {"List my invoices", "Create an invoice", "Pay an invoice", "Get my balance", "Quit"});
        term.clear();
        if cmd == 1 then
            listInvoices();
        end
        if cmd == 2 then
            createInvoice();
        end
        if cmd == 3 then
            payInvoice();
        end
        if cmd == 4 then
            viewBalance();
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