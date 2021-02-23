
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

    post = function (self, path, authed, body)
        local resp, errorReason = http.post({ url=self:getUrl(path), headers=self:getHeaders(authed), body=textutils.serializeJSON(body)});
        if errorReason then
            print("post failed "..errorReason);
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

    register = function (self, username, password)
        local resp = self:post("api/auth/register", false, {
            userName=username,
            password=password
        });

        if resp.statusCode then
            return false;
        end

        self:saveToken(resp.token);
        return true;
    end
};

function registerFlow()
    print("=========");
    print("Registering new user.");
    print("- Username:");
    local username = read();
    print("- Password:");
    local pwd = read("*");

    local didReg = Api:register(username, pwd);
    if not didReg then
        print("We couldn't register you, please try again.");
        registerFlow();
    else
        print("wuuh");
        print(Api.token);
    end
end

function loginFlow()
    print("Unimplemented!");
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

function main()
    print("Dankyer LLC Bank wallet-app V 0.0");
    local loadedToken = Api.loadToken();
    if loadedToken then
        print("Welcome back!");
    else
        unathorizedFlow();
    end
end

main();