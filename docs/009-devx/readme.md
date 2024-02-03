 # DevEx updates
 
 ## 01 - fix dev container and add test in GitHub


Resources: 
* [StackOverflow:Github actions run jobs in webserver container unable to connect to localhost](https://stackoverflow.com/questions/75460950/github-actions-run-jobs-in-webserver-container-unable-to-connect-to-localhost)
* [GitHub service containers](https://docs.github.com/en/actions/using-containerized-services/about-service-containers)

## 02 - Prebuild dev container

Not strictly necessary but I would rather do this now than later.

Requirements(?):

* DevContainer CLI
* GH CLI

Resources: 

* [Video about prebuilds](https://www.youtube.com/watch?v=M21loGvplVM)
* [Prebuild instructions](https://containers.dev/guide/prebuild)
* [Dev container prebuilds](https://containers.dev/guide/prebuild)
* [K8 repo which uses prebuilds](https://github.com/craiglpeters/kubernetes-devcontainer)

Todo:

* Package fails to build: change `.devcontainer.json` => `devcontainer.json`

##

* When pulling remote into local main, do not rebuild container as requested by IDE.

##

* denied: installation not allowed to Create organization package
* https://stackoverflow.com/questions/76607955/error-denied-installation-not-allowed-to-create-organization-package

## 06 Tag image

`imageTag`

## 07 Tag image - need latest
