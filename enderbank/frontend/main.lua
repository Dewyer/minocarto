
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

    getHeaders = function (authed)
        if authed then
            return {
                Authorization="Bearer "..self.token,
            };
        else
            return {};
        end
    end,

    getUrl = function (path)
        return self.url..path;
    end,

    post = function (path, authed, body)
        local resp = http.post({ url=self.getUrl(), headers=self.getHeaders(authed), body=textutils.serializeJSON(body)});
        local respJson = textutils.unserializeJSON(resp);

        return respJson;
    end,

    saveToken = function (tokenData)
        local tokFile = fs.open("./token", "w");
        tokFile.write(tokenData);
        self.token = tokenData;
        tokFile.close();
    end,

    loadToken = function ()
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

    register = function (username, password)
        local resp = self.post("api/auth/register", false, {
            userName=username,
            password=password
        });

        if resp.statusCode then
            return false;
        end

        self.saveToken(resp.token);
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

    local didReg = Api.register(username, pwd);
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