 # DevEx updates
 
 ## 01 - fix dev container and add test in GitHub

Issue: The dev container's docker-compose file isn't working as expected to start up the full stack.

Once that is fixed, also need to CI test to make sure the fix sticks on subsequent changes. 

Fixes: 

* Change port number for API used in frontend to 3000. No idea why it was set to 5173. 
* Change docker-compose.yml
    * Add container names
    * Refer to db in connection string by container name: `mongodb`, such as `mongodb:27017`
    * Add healthchecks with delays and retries
    * Add network then commented it out
* Add scripts to clean up CI runs and old workflows
* Create CI (devx.yml) to start up docker-compose in CI and make sure full-stack works via some simple test. The API works and can be tested with cURL. The front-end can't be tested because it doesn't have any playwright/UI tests and a cURL command just returns the basic HTML without JS so true page doesn't display.
    * In CI, docker-compose services would spin up but cURL was either refused or reset. Solution was to add `docker/setup-buildx-action@v1`.  

Verified: Manually tested, tested in CI

Resources: 
* [StackOverflow:Github actions run jobs in webserver container unable to connect to localhost](https://stackoverflow.com/questions/75460950/github-actions-run-jobs-in-webserver-container-unable-to-connect-to-localhost)
* [GitHub service containers](https://docs.github.com/en/actions/using-containerized-services/about-service-containers)

## 02 - Prebuild dev container

Not strictly necessary but I would rather do this now than later. Separate DevContainer management for repo from personal preferences for IDE in dev container. Prebuilds require pushing to a container registry so choosing the GitHub registry because it is the fastest in terms of setup. 

1) Add `.devcontainer` folder to `.github`.
2) Separate out repo from individual settings
3) Create CI for pushing CI to GH registry based on [craiglpeters/kubernetes-devcontainer](https://github.com/craiglpeters/kubernetes-devcontainer/blob/master/.github/workflows/devcontainer-build-and-push.yml)

    ```
    name: devcontainer

    on:
    workflow_dispatch:
    pull_request:
        paths:
            - '.github/workflows/devcontainer.yml'

    jobs:
    build-and-push:
        runs-on: ubuntu-latest
        steps:
        - 
        name: Checkout
        id: checkout
        uses: actions/checkout@v1
        -
            name: Login to GitHub Container Registry
            uses: docker/login-action@v2
            with:
            registry: ghcr.io
            username: ${{ github.actor }}
            password: ${{ secrets.REGISTRY_TOKEN }}
        - 
            name: Pre-build dev container image
            uses: devcontainers/ci@v0.2
            with:
            subFolder: .github
            imageName: ghcr.io/${{ github.repository }}
            cacheFrom: ghcr.io/${{ github.repository }}
            push: always    
    ```

Requirements(?): These aren't required is CI does all the pushing which in my case it does.

* DevContainer CLI
* GH CLI

Resources: 

* [Video about prebuilds](https://www.youtube.com/watch?v=M21loGvplVM)
* [Prebuild instructions](https://containers.dev/guide/prebuild)
* [Dev container prebuilds](https://containers.dev/guide/prebuild)
* [K8 repo which uses prebuilds](https://github.com/craiglpeters/kubernetes-devcontainer)

Next/Todo:

* Action fails to login to GitHub Container Registry - Username and password required

## 03 - Fix failing CI due to missing file

* When pulling remote into local main, do not rebuild container as requested by IDE.
* Change `password: ${{ secrets.REGISTRY_TOKEN }}` to `password: ${{ secrets.GITHUB_TOKEN }}`

```yml
name: devcontainer

on:
  workflow_dispatch:
  pull_request:
    paths:
        - '.github/workflows/devcontainer.yml'
    
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - 
      name: Checkout
      id: checkout
      uses: actions/checkout@v1
    -
        name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
    - 
        name: Pre-build dev container image
        uses: devcontainers/ci@v0.2
        with:
          subFolder: .github
          imageName: ghcr.io/${{ github.repository }}
          cacheFrom: ghcr.io/${{ github.repository }}
          push: always
```

Next/Todo:

* Still fails to build - looks like it may have the wrong path in the container to the devcontainer.json - missing the `.devcontainer`

## 004 & 005  - Fails to find prebuild devcontainer.json, fails to push to registry

* Change file name `./.github/.devcontainer/.devcontainer.json` => `./.github/.devcontainer/devcontainer.json` - file name doesn't need to start with `.`
* Change GitHub action prebuild subfolder from `subFolder: .github` to `subFolder: .github/workflows/`
* Changed GitHub action to fix [`installation not allowed to Create organization package`](https://stackoverflow.com/questions/76607955/error-denied-installation-not-allowed-to-create-organization-package)

    ```yml
    permissions:
        contents: read
        packages: write        
    ```

## 06 & 007 Tag image

* Add `imageTag` - this was a mistake - the image is already marked with the SHA in the view of packages and the comma-delimited property value isn't [respected by the `devcontainers/ci@v0.3`](https://github.com/devcontainers/ci/issues/276)

## 08 - Move default dev container to use package

* Add welcome message which appears in first new terminal after the dev container opens
* determine what should be in dev container image (package) and what should stay local to just me as developer