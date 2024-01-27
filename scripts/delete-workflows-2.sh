# Get a list of all workflows
workflows=$(gh workflow list --json name,path)

# Iterate over all workflows
for workflow in $(echo "${workflows}" | jq -r '.[] | @base64'); do
  _jq() {
    echo ${workflow} | base64 --decode | jq -r ${1}
  }

  name=$(_jq '.name')
  path=$(_jq '.path')

    # Print name and path
  echo "Deleting workflow: ${name} (${path})"

  # Check if the workflow file exists on disk
  if [ ! -f "${path}" ]; then
    # If the file does not exist, delete the workflow
    gh api -X DELETE /repos/{owner}/{repo}/actions/workflows/${name}
  fi
done