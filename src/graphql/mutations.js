/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addItem = /* GraphQL */ `
  mutation AddItem($input: addItemInput!) {
    addItem(input: $input) {
      pk
      sk
      __typename
    }
  }
`;
export const addItemByUPC = /* GraphQL */ `
  mutation AddItemByUPC($uid: String!, $upc: String!, $name: String) {
    addItemByUPC(uid: $uid, upc: $upc, name: $name) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
    }
  }
`;
export const editItem = /* GraphQL */ `
  mutation EditItem($input: updateItemInput!) {
    editItem(input: $input) {
      pk
      sk
      __typename
    }
  }
`;
export const removeItem = /* GraphQL */ `
  mutation RemoveItem($input: deleteItemInput!) {
    removeItem(input: $input) {
      pk
      sk
      __typename
    }
  }
`;
export const addUser = /* GraphQL */ `
  mutation AddUser($input: addUserInput) {
    addUser(input: $input) {
      pk
      username
      email
      name2
    }
  }
`;
export const createItem = /* GraphQL */ `
  mutation CreateItem(
    $input: CreateItemInput!
    $condition: ModelItemConditionInput
  ) {
    createItem(input: $input, condition: $condition) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $input: UpdateItemInput!
    $condition: ModelItemConditionInput
  ) {
    updateItem(input: $input, condition: $condition) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem(
    $input: DeleteItemInput!
    $condition: ModelItemConditionInput
  ) {
    deleteItem(input: $input, condition: $condition) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      pk
      username
      email
      name2
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      pk
      username
      email
      name2
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      pk
      username
      email
      name2
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
