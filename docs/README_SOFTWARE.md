# Software Documentation
The following is documentation on the code used within the Fridge Buddy application, organized by the pages on the application with descriptions of the modules, APIs, and cloud services used.

## Table of Contents
1. [Project Overview](#project-overview)

## Project Overview
The frontend of the mobile application and touchscreen interface is developed using the React Native framework and TypeScript. React Native was chosen for Fridge Buddy because of its cross-platform capabilities for iOS and Android, code reusability between platforms, native performance resulting in a smooth user experience, and large developer community. Thanks to the cross-platform functionality of React Native, we are also able to use the same application for both the mobile application and touchscreen interface. Fridge Buddy incorporates Amazon Web Services (AWS) as its cloud backend for data storage and synchronization, computation of 3rd-Party API calls (e.g. FoodCentral and Spoonacular), and user authentication. AWS was selected as the cloud service provider because of its widely-used services like DynamoDB and Lambda that fulfill Fridge Buddy’s storage and computational needs, as well as its service Amplify which can connect React Native applications to AWS services (which is important for connecting the frontend application with the cloud backend).

<img width="1398" alt="Screen Shot 2024-04-24 at 3 36 54 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/5e2ba4a5-eb27-4aa9-bdb2-4b47c0da2a7e">

_Figure 1: Fridge Buddy System Block Diagram_

## Cloud Backend (Amazon Web Services)
The application's storage and computational backend is powered by Amazon Web Services. The services used in the AWS backend are DynamoDB (AWS’s distributed NoSQL database service, used for storing user, item, and recipe information), Lambda (AWS’s computing platform that allows users to execute specified code as containerized workloads, used for running calls to 3rd party APIs), and Cognito (AWS's identity platform, used for user authentication). The frontend and backend are connected using the AWS Amplify toolkit and React Native library that enable users to connect frontend applications to backend AWS services. Fridge Buddy uses AppSync GraphQL as the middleware by creating a GraphQL schema and resolvers that define how the React Native application can access and call upon the DynamoDB and Lambda backend services. The following is a more in-depth explanation of the configuration and software used in Amazon Web Services.

### DynamoDB

#### Items

#### Users

#### Recipes

### Amplify / AppSync

### Cognito

### Lambda

#### upc_api_call (Get item information from barcode or name)

#### search_recipe (Get recipe information by name)

#### get_recipes (Get recipe information by ingredients)

#### get_smartscan_info (Get item predictions from image)

## Home Page (React Native)

## Scanner Page (React Native)

## Recipes Page (React Native)

## Settings Page / User Authentication Page (React Native)

Software Report (10000+ characters) – README_SOFTWARE.md (or GitHub Wiki)

You need to provide clear and concise documentation for all the code that you have written. It simply
does not suffice to copy all the code into a folder and rely on comments in your code for documentation.
Please provide the following:
• An overview of each software module
• A flow chart indicating the dependencies between these functions. For instance, if you have a
main.py and LCD.py, you need to show that LCD.py is a module used by main.py.
• Dev/build tool information: Package name and version info. For example, OpenCV 4.0.3 with
Python 3.8.1, using CUDA Toolbox 10.0 and GCC 9.1 and CMake 3.14.2
• How to install the project software stack from scratch (a blank hard drive / cloud instance) Please
provide concise documentation on what installation software is needed, and how to build from
source to binary as applicable.
Example:
• Debian Linux 9.1 into embedded system, with kernel patch to enable the USB controller
• how to use CMake to cross-compile code, how to transfer binary into the target, how target
autoruns binary, etc.
• How to setup/startup cloud instance that collects and processes data from the embedded
system
