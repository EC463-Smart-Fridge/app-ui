# Software Documentation
The following is documentation on the code used within the Fridge Buddy application, organized by the pages on the application with descriptions of the modules, APIs, and cloud services used.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Cloud Backend](#cloud-backend-amazon-web-services)
    - [DynamoDB](#dynamodb)
    - [Amplify / AppSync](#amplify--appsync)
    - [Cognito](#cognito)
    - [Lambda](#lambda)
3. [Home Page](#home-page-react-native)
4. [Scanner Page](#scanner-page-react-native)
5. [Recipes Page](#recipes-page-react-native)
6. [Settings Page](#settings-page--user-authentication-page-react-native)

## Project Overview
The frontend of the mobile application and touchscreen interface is developed using the React Native framework and TypeScript. React Native was chosen for Fridge Buddy because of its cross-platform capabilities for iOS and Android, code reusability between platforms, native performance resulting in a smooth user experience, and large developer community. Thanks to the cross-platform functionality of React Native, we are also able to use the same application for both the mobile application and touchscreen interface. Fridge Buddy incorporates Amazon Web Services (AWS) as its cloud backend for data storage and synchronization, computation of 3rd-Party API calls (e.g. FoodCentral and Spoonacular), and user authentication. AWS was selected as the cloud service provider because of its widely-used services like DynamoDB and Lambda that fulfill Fridge Buddy’s storage and computational needs, as well as its service Amplify which can connect React Native applications to AWS services (which is important for connecting the frontend application with the cloud backend).

<img width="1398" alt="Screen Shot 2024-04-24 at 3 36 54 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/5e2ba4a5-eb27-4aa9-bdb2-4b47c0da2a7e">

_Figure 1: Fridge Buddy System Block Diagram_

## Cloud Backend (Amazon Web Services)
The application's storage and computational backend is powered by Amazon Web Services. The services used in the AWS backend are DynamoDB (AWS’s distributed NoSQL database service, used for storing user, item, and recipe information), Lambda (AWS’s computing platform that allows users to execute specified code as containerized workloads, used for running calls to 3rd party APIs), and Cognito (AWS's identity platform, used for user authentication). The frontend and backend are connected using the AWS Amplify toolkit and React Native library that enable users to connect frontend applications to backend AWS services. Fridge Buddy uses AppSync GraphQL as the middleware by creating a GraphQL schema and resolvers that define how the React Native application can access and call upon the DynamoDB and Lambda backend services. The following is a more in-depth explanation of the configuration and software used in Amazon Web Services.

### DynamoDB
DynamoDB is AWS’s distributed NoSQL database service, meaning that there is no enforced table schema for the stored data. The data is instead only accessed through a single key (which can be split into a partition and a sort key). Fridge Buddy utilizes DynamoDB for storing and accessing user information (username, password, email, and name) and item information (name, Universal Product Code, expiration date, quantity, calories, category, and image URL), with its NoSQL schema allowing for all information belonging to a given user being easily accessible and queryable using the user’s ID. The database "schema" uses the user's ID as the partition key, with the sort key being the entity ID (item, user, or recipe ID). This means that all 3 entity types are all being stored within the same table, with all information pertaining to a single user being queryable using a single query using the user's ID.

<img width="1123" alt="Screen Shot 2024-04-24 at 5 44 48 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/7801cb44-2fd2-4efc-be27-f383eec35b13">

_Figure 2: DynamoDB Database Schema_

For the simplicity of visualization, in the below visuals of example table entries it shows specific entity types, but in reality all of the entities are stored in the same table (with the fields pertaining to other entities being 'null'). The list of entity fields is based on what was defined in the GraphQL schema.

#### Items
Item entities store information on individual user items, used for item management and storing important information about items such as the expiration date, calorie count, and quantity. These are the entities used for displaying items, as well as what are used for generating recipe by ingredients.

- **pk**: String (User ID, partition key for DynamoDB)
- **sk**: String (Item ID, sort key for DynamoDB)
- **UPC**: String (Universal Product Code used in barcodes)
- **name**: String (Name of item)
- **category**: String (Food category)
- **calories**: String (Number of calories)
- **exp_date**: Int (Expiration Date)
- **added_date**: Int (Date item was added to user)
- **quantity**: Int (Item quantity)
- **prod_name**: String (General product name used for recipes, generated by app)

#### Users
User entities store the basic information about users that are given in user sign up. This information is not actually used for authentication (since that is handled by Cognito), but instead is for displaying user information and for initializing the partition for the user. The user ID used throughout the DynamoDB table is based on the ID generated by Cognito when creating a new user.

- **pk**: ID! (User ID, partition key for DynamoDB)
- **sk**: ID! (User ID, sort key for DynamoDB)
- **username**: String! (Username, used for logging in)
- **email**: String! (Email)
- **name2**: String! (User's name)


#### Recipes
Recipe entitities store information on all of the recipes saved to the user's account. Recipes are only saved / removed from the user's account based on the 'favorited' button (so recipes searched but not favorited are not saved to the user's account). It stores all of the information on the recipe, including the recipe name, calorie count, list of steps, list of ingredients, and image URL.

- **pk**: ID! (User ID, partition key for DynamoDB)
- **sk**: String! (Recipe ID, from Spoonacular)
- **recipe_name**: String (Recipe name)
- **img**: String (Img URL from Spoonacular)
- **steps**: [String] (List of recipe steps)
- **ingredients**: [ingredient] (List of ingredient steps)
- **calories**: String

### Amplify / AppSync
Amplify is AWS’s toolkit that enables users to connect frontend applications to backend AWS services. Fridge Buddy uses Amplify’s React Native library and features to connect the previously mentioned AWS services to the React Native frontend application. Amplify was also selected for Fridge Buddy because of its “Auth” features that allow frontend applications to easily set up the AWS Cognito service for user authentication.
AppSync is the middleware that Amplify uses to connect frontend applications to backend services. Fridge Buddy utilizes AppSync’s GraphQL API to define how the React Native application can interact with the application’s DynamoDB database and Lambda function calls.

The GraphQL schema defines all of the datatypes (such as the entities mentioned above), as well as all of the mutations and queries that the React Native application can perform to interact with DynamoDB and Lambda. AppSync establishes the data sources that can be connected to by the mutations and resolvers (DynamoDB table and Lambda functions in this case). Each mutation and query has a corresponding resolver that defines what actual operation / code to run in the backend.

The GraphQL schema used for this project can be found [here]([url](https://github.com/Fridge-Buddy/ui/blob/main/amplify/backend/api/awsomefridge/schema.graphql)).

### Cognito
Cognito is AWS's identity management platform. Fridge Buddy utilizes Cognito through Amplify Auth, 

### Lambda
Lambda is AWS’s computing platform that allows users to execute specified code as containerized workloads. Lambda was selected because of its lightweight nature, only using computational resources when a function is called. Fridge Buddy is using the service for querying 3rd party APIs that are called by and connected to the React Native frontend application using AWS Amplify. The Lambda functions Fridge Buddy uses include querying the FoodCentral API for item information and inserting the item into DynamoDB for users, as well as querying the Spoonacular API with user items to get suggested recipes and recipe nutritional information.

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
