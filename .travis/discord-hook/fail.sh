#!/usr/bin/env bash
echo 'Sending Discord Webhook';
export AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")";
export BRANCH_OR_PR="$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo "PR-$TRAVIS_PULL_REQUEST"; fi)";
export SOURCE_URL="$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo "https://github.com/"$REPO_OWNER"/"$REPO_NAME"/commit/"$TRAVIS_COMMIT""; else echo "https://github.com/"$REPO_OWNER"/"$REPO_NAME"/pull/"$TRAVIS_PULL_REQUEST""; fi)";
export BACKTICK='`';
export TIMESTAMP=$(date --utc +%FT%TZ);
export COMMIT_FORMATTED="[$BACKTICK${TRAVIS_COMMIT:0:7}$BACKTICK](https://github.com/$REPO_OWNER/$REPO_NAME/commit/$TRAVIS_COMMIT)";
curl -v -H User-Agent:bot -H Content-Type:application/json -d '{"avatar_url":"https://i.imgur.com/kOfUGNS.png","username":"Travis CI","embeds":[{"author":{"name":"Build #'"$TRAVIS_BUILD_NUMBER"' Failed - '"$AUTHOR_NAME"'","url":"https://travis-ci.org/'"$REPO_OWNER"'/'"$REPO_NAME"'/builds/'"$TRAVIS_BUILD_ID"'"},"url":"'"$SOURCE_URL"'","title":"['"$TRAVIS_REPO_SLUG"':'"$BRANCH_OR_PR"'] ","color":16711680,"fields":[{"name":"_ _", "value": "'"$COMMIT_FORMATTED"' - '"$TRAVIS_COMMIT_MESSAGE"'"}]}]}' $DISCORD_WEBHOOK_URL;
