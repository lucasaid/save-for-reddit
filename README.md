# Saved Posts Oragniser for Reddit

This is a small local webserver that pulls your data from your reddit saved posts.  
It will allow you to tag, search and organise your saved posts.

## NOTE: STILL A WORK IN PROGRESS

## Installing

run `npm install -g save-for-reddit`

## Running

1. First you will have to create a reddit client key and secret from https://www.reddit.com/prefs/apps
2. Then head to https://not-an-aardvark.github.io/reddit-oauth-helper/ and enter your client id and client secret
3. Select permanent so you don't need to regenerate access token
4. Then select `account` `history` and `read`. 
5. Click generate tokens
6. Once you have that data, run `save-for-reddit` and you will be prompted to enter you client id, client secret, refresh token and access token.
7. If all good the app will pull all of your saved posts into a local json file then a sever will start at http://localhost:8000/
8. Head to http://localhost:8000/ in your browser
9. ?
10. Profit

### NOTE:

- Right now this is still a work in progress and not ready to be pushed to NPM, if you would like to check it out clone this repo, then run a `npm link` on the directory, or run `node ./lib/index.js`
- The data is only pulled in once, in order to update the data you will need to run `save-for-reddit -g`
- To grab everything and reset the data completely run `save-for-reddit -ga` (NOTE: this will erase all the tags you have added ect)
- To set a limit to what you grab run `save-for-reddit -g -l 10`
