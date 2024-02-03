01 - fix dev container and add test in GitHub

https://stackoverflow.com/questions/75460950/github-actions-run-jobs-in-webserver-container-unable-to-connect-to-localhost
https://docs.github.com/en/actions/using-containerized-services/about-service-containers

02 - Prebuild dev container

https://containers.dev/guide/prebuild

https://github.com/craiglpeters/kubernetes-devcontainer

```
    // Image to pull when not building from scratch. See .devcontainer/build/devcontainer.json 
    // and .github/devcontainer-build-and-push.yml for the instructions on how this image is built
    "image": "ghcr.io/craiglpeters/kubernetes-devcontainer:latest",
    
    
    "remoteUser": "root"
```