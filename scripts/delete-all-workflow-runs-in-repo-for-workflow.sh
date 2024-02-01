# Define repository owner and name
owner="dfberry"
repo="cloud-native-todo"
target_workflow_name="your-target-workflow-name"  # replace with your target workflow name

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

  echo "Workflow: ${name} ${id} ${path}"

  # Check if the workflow name matches the target workflow name
  if [ "$name" = "$target_workflow_name" ]; then
    # Get a list of all runs for the workflow
    get_runs_command="gh api -X GET '/repos/${owner}/${repo}/actions/workflows/${id}/runs'"
    echo $get_runs_command
    runs=$(eval $get_runs_command)

    # Iterate over all runs
    for run in $(echo "${runs}" | jq -r '.workflow_runs[] | @base64'); do
      _jq_run() {
        echo ${run} | base64 --decode | jq -r ${1}
      }

      run_id=$(_jq_run '.id')

      # Delete the run
      delete_run_command="gh api -X DELETE '/repos/${owner}/${repo}/actions/runs/${run_id}'"
      echo $delete_run_command
      eval $delete_run_command
    done
  fi
done