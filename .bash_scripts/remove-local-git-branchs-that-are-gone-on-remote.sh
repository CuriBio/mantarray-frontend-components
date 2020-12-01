set -ex
# check remote for any updates and prune old branches deleted on remote
git fetch --prune
# delete local branches that are listed as "gone" on remote
git branch -vv | grep ': gone]'|  grep -v "\*" | awk '{ print $1; }' | xargs -r git branch -d