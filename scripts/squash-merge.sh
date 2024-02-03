commit_count=$(git rev-list --count main..HEAD)

git rebase -i HEAD~$commit_count