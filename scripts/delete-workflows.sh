# Get a list of all workflow names
workflow_names=$(gh workflow list --json name | jq -r '.[] | .name')

# Iterate over all workflow names
for workflow_name in $workflow_names; do

  # Print out name
  echo "Deleting workflow run list: $workflow_name"

  # Get a list of all run IDs for the current workflow
  run_ids=$(gh run list --limit 500 --workflow "$workflow_name" --json name | jq -r '.[] | .name')

  # Print out count of run_ids
  echo "Found $(echo "$run_ids" | wc -l) runs"

  # Check if run_ids is not empty
  if [ -n "$run_ids" ]; then
    # Iterate over all run IDs and delete the runs
    for run_id in $run_ids; do

      # Print out run ID
      echo "Deleting run: $run_id"

      gh run delete "$run_id" --confirm
    done
  fi

  # Check if the workflow file doesn't exists in the repo
  if [ ! -f ".github/workflows/$workflow_name.yml" ]; then

    # Print out workflow file name
    echo "Deleting orphaned workflow record: $workflow_name.yml"

    # If the workflow file does not exist, delete the workflow
    gh api -X DELETE /repos/{owner}/{repo}/actions/workflows/$workflow_name.yml
  fi
done

#gh run list --limit 500 --workflow "AZD Deploy" --json id | jq -r '.[] | .id'