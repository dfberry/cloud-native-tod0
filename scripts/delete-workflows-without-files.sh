# Get a list of all workflows
workflows=$(gh workflow list --json id,path)

# Iterate over all workflows
for workflow in $(echo "${workflows}" | jq -r '.[] | @base64'); do
  _jq() {
    echo ${workflow} | base64 --decode | jq -r ${1}
  }

  name=$(_jq '.name')
  id=$(_jq '.id')
  path=$(_jq '.path')

  # Check if the workflow file exists in the repo
  if [ ! -f "${path}" ]; then

    # Print name and path
    echo "Deleting workflow: #{name} ${id})"

    # If the file does not exist, delete the workflow
    gh api -X DELETE /repos/{owner}/{repo}/actions/workflows/${id}
  fi
done