yelp_init();

/* Grab access token and token type from Yelp */
function yelp_init() {
    $.post("https://api.yelp.com/oauth2/token", {
        client_id: "XSB11XkGiPzzB6Oq3rJ77A",
        client_secret: "2XtQUalVyB6z6Ety9veg5qICLMQpmobGZGz9cqrlUms8FtqIwo2h6uxOTWeoVODn",
        grant_type: "client_credentials"
        },
        function(response) {
            console.log("Yelp Authorization Successful ", response);

            window.localStorage.setItem("token", response.access_token);
            window.localStorage.setItem("token_type", response.token_type);
        });
};
