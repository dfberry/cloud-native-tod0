# Follow up

Conversations included: 

* Cloud-native versus cloud-agnostic
* Provisioning for long-life resources versus short
* General provisioning management and organization versus deployment

## Cloud-native versus cloud-agnostic

A friend wondered if I was interested in cloud-native or cloud-agnostic. What does that mean? 

Prompt: Compare and contrast cloud-native and cloud-agnostic?

GitHub Copilot: Cloud-native and cloud-agnostic are two different approaches to building and deploying applications in the cloud.

Cloud-native is an approach that is designed to take full advantage of cloud-specific features and services. Cloud-native applications are built from the ground up to leverage the unique capabilities of the cloud platform they are designed for. This includes using microservices, containers, serverless functions, and infrastructure as code. These applications can take full advantage of the scalability, performance, and innovative services offered by the specific cloud platform.

On the other hand, cloud-agnostic is an approach where applications are designed to operate on any cloud platform or even across multiple cloud platforms without requiring any modification. The goal is to avoid vendor lock-in and to be able to move applications freely between different cloud providers. This is achieved by using only the common features and services that are available on all cloud platforms, or by using a layer of abstraction (like Kubernetes or Terraform) that works across different cloud platforms.

In summary, cloud-native applications can fully leverage the features and services of a specific cloud platform, which can lead to better performance and more innovative capabilities, but at the risk of vendor lock-in. Cloud-agnostic applications have the flexibility to operate on any cloud platform, which can provide more freedom and flexibility, but they may not be able to take full advantage of the unique features and services offered by each cloud platform.

My perspective: I would like to do both but cloud-native is the goal. I'm choosing tools that are cloud-agnostic which that makes sense. An example is choosing terraform. 

While I'm using terraform, which is cloud-agnostic, I'm learning and using what I know for a quicker path to completion. I know Azure which helps with provisioning with terraform. Because I'm using Azure, there will be Azure-_ish_ tools, and choices. An example is Azure Developer CLI, which helps with provisioning and finishes with deployment. 