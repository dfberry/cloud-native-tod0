# Cloud native Todo

This repo documents my journey to solidify my cloud native understand. I'll use ChatGPT conversations to learn. This includes building a roadmap, and accomplishing each goal on the roadmap.

## Branches 

* 001-Cloud-native
* 002-Developer-environment-setup
* 003-Api-test 
* 004-Infra-as-code-and-api-test
* 005-Deploy-from-GitHub
* 006-Client-todo
* 007-Add-client-info 
* 008-MongoDB
* 009-DevX - Prebuild dev container

## Which AI to use? 

Generally, I'll use GitHub Copilot from inside Visual Studio Code for answers which are context-aware. If the answers don't align with my current understanding, I'll experiment with the conversation and the code until I think my solution is as cloud native (or cloud-agnostic) as I can get it. 

## What is cloud native? 

To me, cloud native means cloud-agnostic. The tools, processes, and code should generally work on any cloud. 

Most of my current experience is on Azure and is Azure native, which uses tools that aren't available on other clouds. This will be my fallback for expediency but won't be my first method to solve a problem.

## YouTube playlists

* [Install and configure Azure Developer CLI](https://www.youtube.com/watch?v=zxGl4L_WwoE&list=PLAQX7qAUlTDhMm-Lkr91NCPAvrCRcaFEF)
* [Setup GitHub for deploy from repository](https://www.youtube.com/watch?v=zxGl4L_WwoE&list=PLAQX7qAUlTDhMm-Lkr91NCPAvrCRcaFEF&pp=iAQB)

## Open dev container

Open this repo in a dev container in Visual Studio Code or in GitHub Codespaces.

## Install

To install all workspaces

```
npm install
```

## To deploy from development environment

Use Azure Developer CLI to deploy

```
azd auth login
azd deploy
```

## To rerun postdeploy hook

Troubleshooting: if local deploy fails on Playwright test, rerun to `postdeploy` use following command

```
azd hooks run postdeploy --debug
```

Output looks like:

```
root ➜ /workspaces/cloud-native-todo (dfberry/fix-api-log-location) $ azd hooks run postdeploy --debug
2023/12/19 02:42:16 main.go:54: azd version: 1.5.0 (commit 012ae734904e0c376ce5074605a6d0d3f05789ee)
2023/12/19 02:42:16 main.go:208: using cached latest version: 1.5.0 (expires on: 2023-12-20T02:25:23Z)
2023/12/19 02:42:16 project.go:113: Reading project from file '/workspaces/cloud-native-todo/azure.yaml'
2023/12/19 02:42:16 cobra_builder.go:141: Resolved action 'azd-hooks-run-action'
2023/12/19 02:42:16 middleware.go:124: running middleware 'debug'
2023/12/19 02:42:16 middleware.go:124: running middleware 'experimentation'
    1 passed (1.7s)
  
  To open last HTML report run:
  
    npx playwright show-report
  
  Test completed

  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────2023/12/19 02:42:19 command_runner.go:307: Run exec: ' /tmp/azd-postdeploy-3726761669.sh' , exit code: 0
Additional env:
   SERVICE_API_TODO_RESOURCE_EXISTS=<redacted>
   AZURE_KEY_VAULT_ENDPOINT=<redacted>
   AZURE_KEY_VAULT_NAME=<redacted>
   AZURE_CONTAINER_REGISTRY_ENDPOINT=<redacted>
   SERVICE_API_TODO_IMAGE_NAME=<redacted>
   AZURE_ENV_NAME=<redacted>
   AZURE_LOCATION=<redacted>
   API_TODO_ENDPOINT=<redacted>
   AZURE_SUBSCRIPTION_ID=<redacted>
-------------------------------------stdout-------------------------------------------
/workspaces/cloud-native-todo
***** Root postdeploy
postdeploy.sh
Getting param 1
ENV_PATH: ./api-todo-test/.env
Remove old .env file
Getting values from azd
Run test at ./api-todo-test

> api-todo-test@1.0.0 test
> npx playwright test

baseURL https://ca-api-todo-123.redfield-123.eastus2.azurecontainerapps.io

Running 1 test using 1 worker
baseURL https://ca-api-todo-123.redfield-123.eastus2.azurecontainerapps.io
api.spec.ts:11:5 › should get all todos
baseURL https://ca-api-todo-123.redfield-123.eastus2.azurecontainerapps.io
  1 passed (1.7s)

To open last HTML report run:

  npx playwright show-report

Test completed
-------------------------------------stderr-------------------------------------------
  (✓) Done: Running postdeploy command hook for project
  Running postdeploy service hook for api-todo

  ──────────── api-todo: postdeploy hook output ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────


  ***** api-todo postdeploy
2023/12/19 02:42:19 hooks_runner.go:162: Executing script '/tmp/azd-postdeploy-2881386505.sh'
  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  (✓) Done: Running postdeploy service hook for api-todo
Additional env:
SUCCESS: Your hooks have been run successfully
```

## To setup GitHub repo for deployment

```
azd pipeline config
```

Output looks like:

```
root ➜ /workspaces/cloud-native-todo (dfberry/docs-update) $ azd pipeline config

Configure your GitHub pipeline

? This command requires you to be logged into GitHub. Log in using the GitHub CLI? Yes
? What is your preferred protocol for Git operations? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Login with a web browser

! First copy your one-time code: 1234-1234
Press Enter to open github.com in your browser... 
✓ Authentication complete.
- gh config set -h github.com git_protocol https
✓ Configured git protocol
✓ Logged in as dfberry

  (✓) Done: Checking current directory for Git repository
  (✓) Done: Creating service principal az-dev-12-19-2023-02-51-11 (48dcb0f9-0714-4ae8-9bb2-eb5854f219fb)
  (✓) Done: Federated identity credential for GitHub: subject repo:dfberry/cloud-native-todo:pull_request
  (✓) Done: Federated identity credential for GitHub: subject repo:dfberry/cloud-native-todo:ref:refs/heads/dfberry/docs-update
  (✓) Done: Federated identity credential for GitHub: subject repo:dfberry/cloud-native-todo:ref:refs/heads/main
  (✓) Done: Setting AZURE_SUBSCRIPTION_ID repo variable
  (✓) Done: Setting AZURE_TENANT_ID repo variable
  (✓) Done: Setting AZURE_CLIENT_ID repo variable
  (✓) Done: Setting AZURE_ENV_NAME repo variable
  (✓) Done: Setting AZURE_LOCATION repo variable

  GitHub Action secrets are now configured. You can view GitHub action secrets that were created at this link:
  https://github.com/dfberry/cloud-native-todo/settings/secrets/actions

? Would you like to commit and push your local changes to start the configured CI pipeline? Yes
remote: 
remote: Create a pull request for 'dfberry/docs-update' on GitHub by visiting:
remote:      https://github.com/dfberry/cloud-native-todo/pull/new/dfberry/docs-update
remote: 

  (✓) Done: Pushing changes
  (✓) Done: Queuing pipeline

SUCCESS: Your GitHub pipeline has been configured!
Link to view your new repo: https://github.com/dfberry/cloud-native-todo
Link to view your pipeline status: https://github.com/dfberry/cloud-native-todo/actions
```

# Infra

```bash
azd auth login --use-device-code
az login --use-device-code
bash scripts/clean.sh
azd env new todo-a
azd provision
bash scripts/local-service-principal.sh
bash scripts/create-env-docker.sh
azd deploy
```

1. Sign into Azure Cloud: `az login --use-device-code`
1. Sign into Azure Developer CLI: `azd auth login --use-device-code`
1. Clean out old file first: `bash scripts/clean.sh`
1. azd env new todo-a # or todo-b
1. Provision the infrastructure so you have the `.env` file in `.azure` folder
1. Create service principal for use with local development
1. Create the `.env.docker` file with other required settings and propagate to packages.
1. Deploy via `azure.yml`. The Dockerfile in each package pulls in the `.env` file for each package and then builds to an image.
