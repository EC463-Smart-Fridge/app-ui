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

## Installation Steps
Andres work on this please please please please please

From grading rubric: "
- How to install the project software stack from scratch (a blank hard drive / cloud instance) Please
provide concise documentation on what installation software is needed, and how to build from
source to binary as applicable.
Example:
- Debian Linux 9.1 into embedded system, with kernel patch to enable the USB controller
- how to use CMake to cross-compile code, how to transfer binary into the target, how target
autoruns binary, etc.
- How to setup/startup cloud instance that collects and processes data from the embedded
system
"

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
Cognito is AWS's identity management platform. Fridge Buddy utilizes Cognito for user authentication, confirmation, sign-up, sign-in, and logout. Cognito was configured for Fridge Buddy using the Amplify CLI tools using Amplify Auth:

<img width="1176" alt="Screen Shot 2024-03-17 at 4 07 51 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/24c9c0f5-4638-495f-b52e-a9245009e8fe">

_Figure 3: Configuration settings for Amplify Auth_

### Lambda
Lambda is AWS’s computing platform that allows users to execute specified code as containerized workloads. Lambda was selected because of its lightweight nature, only using computational resources when a function is called. Fridge Buddy is using the service for querying 3rd party APIs that are called by and connected to the React Native frontend application using AWS Amplify. The Lambda functions Fridge Buddy uses include querying the FoodCentral API for item information and inserting the item into DynamoDB for users, querying the Spoonacular API with user items to get suggested recipes and recipe nutritional information, querying the Spoonacular API with a recipe name to get suggested recipes and recipe nutritional information, and querying the Clarifai API for getting the item predictions given an image.

#### Third-Party APIs Used
Fridge Buddy incorporates multiple external APIs and libraries for functionalities such as querying for item information and object recognition. The external APIs used by the application are:

- **FoodCentral**: United States Department of Agriculture (USDA)’s official API and database for storing food product information such as Universal Product Code (UPC) and nutrition information. This API is called using an AWS Lambda function when users add items using UPC barcodes or object recognition. When users add an item in those ways, Fridge Buddy sends the barcode or item name retrieved from object recognition to FoodCentral to query item information including item name, category, and calorie count. This API was chosen because of its large size, breadth of information, and its credibility from being created by the USDA.
- **Spoonacular**: An online API with a large breadth of capabilities including getting a list of recipes using given product names and retrieving recipe nutritional information. Spoonacular was selected because of its generous API free tier for prototyping, as well as its capabilities for gathering recipe information. Although Spoonacular includes barcode lookup functions, its limited database made FoodCentral the better option.
- **Clarifai**: An online API that uses a pre-trained model to classify food items in an inputted image. This API can recognize multiple food items within a single image and returns a list of all possible food names and their corresponding accuracy percent. Fridge Buddy uses this API with its smart scanner to use object recognition for inputting user items. This API was also selected because its multi-item output allows users to input multiple items with a single image.

#### upc_api_call (Get item information from barcode or name)
This Lambda function is used to get item information (product name, item name, calorie count, predicted expiration date, and food category), and insert the item into the user's items. The function takes the user ID and either a barcode or item name as input, and is used for adding items from the barcode scanner and smart scanner. The functionality of the function is as follows:
- The function queries **FoodCentral** using the inputted UPC code / item name for getting item information (calories, food category, and item name if sent UPC code).
- If the input was a UPC code (not an item name), query **Spoonacular** to get the generic product name from the branded product name gotten from FoodCentral. If the input was just an item name (in the case of smart scanner), then just use the item name as the generic product name.
- Using the generic product name, call the expiration date prediction function, which uses a locally stored dataset of predicted expiration times for 684 different food types (calculated using extracted data from the **FoodKeeper** dataset from the USDA FSIS) to search for a relevant food type and caculate a predicted expiration date. If a relevant item type is found from the inputted item name, then calculate and store the expiration date based on the current date.
- Insert the item information gathered into the DynamoDB table under the current user.

Labeled as and ran as the "addItemByUPC" mutation in the GraphQL schema.

#### search_recipe (Get recipe information by name)
This Lambda function is used for querying **Spoonacular** for recipe information (recipe name, calorie count, list of steps, image URL, and list of ingredients) given a recipe name. This functionality is called from Fridge Buddy for being able to search for recipes using the Search bar on the **Recipes** page. The functionality of the function is as follows:
- Query **Spoonacular** API **complexSearch** gateway to get a list of recipe IDs using the inputted recipe name.
- For the top 5 recipe IDs found:
    - Query **analyzedInstructions** under the recipe ID to get instruction information for current recipe.
    - Query **nutritionWidget.json** under the recipe ID to get the calorie information for current recipe.
    - Query **information** under the recipe ID to get the list of ingredients and ingredient amounts
 - Return the list of recipes with all of the relevant recipe fields.

Labeled as and ran as the "searchRecipes" query in the GraphQL schema.

#### get_recipes (Get recipe information by ingredients)
This Lambda function is used for querying **Spoonacular** for recipe information (recipe name, calorie count, list of steps, image URL, and list of ingredients) given a list of ingredients. This functionality is called from Fridge Buddy for being able to search for recipes using the Search bar on the **Recipes** page. The functionality of the function is as follows:
- Query **Spoonacular** API **findByIngredients** gateway to get a list of recipe IDs using the inputted ingredients, querying to make the use of as many ingredients as possible.
- For the top 5 recipe IDs found:
    - Query **analyzedInstructions** under the recipe ID to get instruction information for current recipe.
    - Query **nutritionWidget.json** under the recipe ID to get the calorie information for current recipe.
    - Query **information** under the recipe ID to get the list of ingredients and ingredient amounts
 - Return the list of recipes with all of the relevant recipe fields.

Labeled as and ran as the "getRecipes" query in the GraphQL schema.

#### get_smartscan_info (Get item predictions from image)
This Lambda function is used for querying **Clarifai** for item prediction (list of item names and list of prediction accuracy probabilities) given a base64-encoded image string. This functionality is called from Fridge Buddy's smart scanner to get the list of predictions based on object recognition. The functionality of the function is as follows:
- Query **Clarifai** API using the **food-item-recognition** model to get predictions based on the inputted item.
- Return the list of predictions and accuracy amounts.

Labeled as and ran as the "getItemPredictions" query in the GraphQL schema.

## Home Page (React Native)
![unnamed](https://github.com/Fridge-Buddy/ui/assets/98369076/aa0c9128-4d02-4d11-a0c7-309ffc8103ab)
![unnamed2](https://github.com/Fridge-Buddy/ui/assets/98369076/b2a9dcbb-e75c-4786-b149-37889cb0b8dc)

_Figure 3: Picture of Fridge Buddy UI Home Page and Search Function_

The Home Page is the main page for displaying and managing user item inventory. This page uses the information of the currently logged-in user to query and mutate the list of items belonging to the user. The code for the Home Page is located in the [home.tsx](https://github.com/Fridge-Buddy/ui/blob/main/app/(root)/home.tsx) file. Because this is a user application / item management system, in lieu of a flow chart for the functionality of the Home Page, below is a diagram of the Home Page's functionalities, as well as a description of how the components connect to the backend / other code.

![IMG_0785](https://github.com/Fridge-Buddy/ui/assets/98369076/ada65d92-edb6-40f2-9e26-0b7e5c162644)
![IMG_0786](https://github.com/Fridge-Buddy/ui/assets/98369076/318b057b-429e-4ef9-be2f-82c2995341f6)

_Figure 4: Functionality Diagram of Home Page_

### Software Module / Component Description
The following are descriptions of the components of the Home Page when a user is logged in. When a user is not logged in, they are unable to view the Home Page.

1. **Query and Display User Items**: Whenever the page is rendered or refreshed, the application runs the GraphQL query "getUserItems" to fetch all items under the currently logged-in user in the DynamoDB table. These items are then stored within a useState array of Items (with this and other custom datatypes being defined in [API.ts](https://github.com/Fridge-Buddy/ui/blob/main/src/API.ts)). Within the page, all of the items within this array are rendered as [ItemWidgets](https://github.com/Fridge-Buddy/ui/blob/main/components/ItemWidget.tsx), which handle displaying the item information (name, category, calories, quantity, expiration date), as well as handling calling the edit and delete handlers. The ItemWidget also handles displaying visually which items are soon to expire. For items that are going to expire within 5 days, it will display red text next to the expiration date saying "Expires in X days," and if the item is already expired, the whole item container will display as red.
2. **Search**: The Search bar allows users to search for specific item names within their item inventory. The code handles this by having a state of what is currently stored in the search bar, with a function running to search through the array of Items to find items that match the current search value.
3. **Select Mode**: The check button is the select mode handler. Within home.tsx, there is a state called "selectState" that depicts whether or not the home page is currently in the select mode. Pressing this button toggles the selectState, which enables users to be able to user to interact with the home page like in the second image in _Figure 4_ for performing functions 8-11.
4. **Sort**: The Sort button ("...") allows users to sort their items in ascending or descending order based on the name, category, calories, quantity, or expiration date fields stored within each item.
5. **Delete Item**: The 'X' button on the individual ItemWidgets is connected to the deleteItemHandler defined in home.tsx and sent to each ItemWidget. This handler is activated upon the user pressing on the 'X' button for the ItemWidget, which deletes the item from the backend using the GraphQL mutation "removeItem" and then removes the item from the Items array (so that it will no longer be displayed on the page).
6. **Edit Item**: The edit button on the individual ItemWidgets is connected to the editItemHandler defined in home.tsx and sent to each ItemWidget. Selecting on the edit button for a given item enters it into the 'Edit' mode. In this mode, it displays the item's name, expiration date, and quantity, with the user being able to modify these values (with the expiration date giving a calendar prompt for the user to select the new date). The user can then hit the 'Cancel' button which will exit the 'Edit' mode and ignore all of the changes made, or the 'Save' button which will invoke the editItemHandler to save the changes made to DynamoDB.
7. **Add Item**: The last item displayed on the user's Home page is the [NewItemWidget](https://github.com/Fridge-Buddy/ui/blob/main/components/NewItemWidget.tsx). Instead of a normal item widget, this allows users to input the item name (required), calories, quantity, expiration date, and category fields. Entering the expiration date prompts the user with a calendar prompt for selecting a date, but all of the other fields take in text. When the user hits the '+' button, as long as there is an item name inputted, the code will call the addItemHandler defined in home.tsx. This handler adds the item to the DynamoDB table using the addItem GraphQL mutation, and adds the item to the current Items array so that it will display.
8. **Select / Deselect Item**: When in 'Select' mode, the user is able to select / deselect items by tapping on the individual ItemWidget. These selected items will be highlighted green, and sets a value inside of the Item value called 'checked' to true (with the value being stored in the Item array for each item).
9. **Select / Deselect All**: This button is at the top left of the screen when entering the 'Select' mode. Pressing the button toggles selecting / deselecting all items.
10. **Generate Recipes**: This button is at the top of the screen when entering the 'Select' mode. Pressing the button will cause the code to run the recipeHandler which gathers all currently saved recipes in the user's account and then generates recipes based on the product name of all of the selected items. While generating recipes, the code will display a loading logo, and once it has finished, it will automatically add these recipes to the global user context's "recipes" array and redirect the user to the **Recipes** Page.
11. **Delete Selected Items**: This button is at the top right of the screen when entering the 'Select' mode. Pressing this button will run the deleteItemHandler on all of the currently selected items and remove them from the user's account.

## Scan Page (React Native)

The Scan page displays a camera view using the device's front or back camera and offers two modes of usage: Barcode scanning and Smart scanning.
The following controls are displayed in the Scan page for user operation:
• **Barcode Scanner / Smart Scanner** toggle at the top of the page - allows the user to switch between the two modes of scanning.
• **Camera Toggle** button at the bottom of the page - allows the user to switch between the front and back camera of their device.

### Barcode Scanning
The Barcode scan mode allows the user to add an item to their inventory by scanning its barcode. It employs the react-native-vision-camera library to display a camera view, and the codeScanner prop to detect barcodes and retrieve the UPC-A code. Upon scanning a barcode, the user is alerted that the item has been scanned, and the addItemByUPC GraphQL mutation is invoked with the retrieved UPC-A code and the user's userID in order to retrieve the item information from FoodCentral and add it to the user's inventory.

The following is the order of operations for a user to add an item using the Barcode scanner:
1. Hold a food item within the camera view so that the barcode is clearly visible.
2. Upon detection, the barcode is immediately scanned and an alert is displayed.
3. Press "OK" within the alert to confirm the successful scan.
4. The food item is added to your inventory and can be viewed within the **Items** page.

### Smart Scanning
The Smart scan mode employs the **Clarifai API** and the **food-item-recognition** pre-trained model so that the user can add food items to their inventory using item recognition. A camera view is displayed using the expo-camera library along with a **Capture** button (circular button) at the bottom of the screen which the user can press to almost instantly receive predictions of which food items are within camera view. The top five predictions are presented in a pop-up from which the user can select 0 or more to add to the inventory. If none of the predictions are correct, the user can select none of them and no item will be added. If a single item was scanned and one of the predictions is correct, the user can select that correct prediction and the item will be added to the inventory. If multiple items were scanned at once and multiple predictions are correct, the user can select all of the correct predictions and they will all be added to the inventory at once.

The following is the order of operations for a user to add items using the Smart scanner:
1. Hold one or more food items within the camera view so that they are fully visible and as clear as possible.
2. Press the **Capture** button.
3. Predictions of items scanned are displayed in a pop-up; select the correct prediction(s).
4. The food item(s) is added to your inventory and can be viewed within the **Items** page.

The following processes occur when adding items using the Smart scanner:
1. Upong pressing the **Capture** button, a still image is captured from the camera view and converted to Base64.
2. The getItemPredictions Lambda function is called with the Base64-formatted image; this function queries **Clarifai** with the Base64-formatted image, specifying to use the **food-item-recognition** model to generate predictions.
3. Predictions are returned from **Clarifai** and the top **five** predictions are displayed within a checkbox-select pop-up in the app.
4. When the user confirms their selected predictions, the addItemByUPC GraphQL mutation is invoked for each of the selections, using the item name instead of a UPC code; this retrieved item information from FoodCentral for each of the selections and adds them to the user's inventory.

## Recipes Page (React Native)

## Settings Page / User Authentication Page (React Native)
These are the pages used for displaying / handling user authentication information.

### User Authentication Page
The User Authentication page handles user sign-up, sign-in, and confirmation. These functions are connected to Cognito using the Amplify Auth library in handlers such as signInHandler and signUpHandler. The user authentication code is located within [Index.tsx](https://github.com/Fridge-Buddy/ui/blob/main/app/(root)/index.tsx). The functionality is as follows:
1. **Sign Up**: For signing up a new user, it requires that the user inputs a username, email, password, and name (1 lowercase, 1 uppercase, 1 number, 1 special character, minimum 8 characters). If a user with the username already exists or an improper password, it will display an error. When the user hits the 'Sign Up' button and it succeeds, it creates a user in Cognito, which generates a user ID and sends a confirmation email to the user's inputted email. This part of the code also inserts the user into DynamoDB using the 'createUser' GraphQL mutation. This adds the user's email, name, and username to the table with the key being the newly generated userID.
2. **Confirm User**: When the user successfully goes through the Sign Up process, they are sent an email with a 6-digit verification code. They are taken to a new prompt that asks them for this code, and once they enter the code successfully, it will successfully activate the user within Cognito (meaning the user will have been successfully activated / created).
3. **Sign In**: For signing in an existing user, it requires that the user inputs the correct username and password pair. If this is unsuccessful, then it displays an error. If successful, the user is logged into their account, with their user information being stored within a global User context that stores information about the currently logged in user (which is used for interacting with the user's items and recipes).

<img width="556" alt="Screen Shot 2024-04-24 at 9 54 17 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/4b2c1f92-212b-467c-b289-4191f059d5c2">
<img width="535" alt="Screen Shot 2024-04-24 at 9 54 29 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/71bc0e78-1808-4b70-8a4d-2ee95651bca2">

_Figure 9: Images of the user interface for user authentication_

### Settings Page

The Settings page displays the currently logged in user's information (username, name, email, and userID). It also includes a button for 'logout' for allowing currently logged in users to log out of their account.

<img width="655" alt="Screen Shot 2024-04-24 at 9 44 51 PM" src="https://github.com/Fridge-Buddy/ui/assets/98369076/8ae73c2d-08fe-47fa-a525-513f6058033b">

_Figure 10: Settings Page_

Software Report (10000+ characters) – README_SOFTWARE.md (or GitHub Wiki)

You need to provide clear and concise documentation for all the code that you have written. It simply
does not suffice to copy all the code into a folder and rely on comments in your code for documentation.
Please provide the following:
• An overview of each software module
• A flow chart indicating the dependencies between these functions. For instance, if you have a
main.py and LCD.py, you need to show that LCD.py is a module used by main.py.
• Dev/build tool information: Package name and version info. For example, OpenCV 4.0.3 with
Python 3.8.1, using CUDA Toolbox 10.0 and GCC 9.1 and CMake 3.14.2

