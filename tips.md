# Tips for better developer experience in this project

* Always run in dev container so you only have one Copilot chat conversation. If you run outside of dev container and chat with Copilot, it doesn't keep that conversation context when you open the dev container.
* Run Azure Developer CLI with `--debug` switch
* Run Azure Developer CLI command you are working on such as `azd package`, `azd provision` or `azd deploy`
* Run curl with `--verbose` switch
* Delete all containers, images, and volumes and start over when dev container doesn't start