/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserItems = /* GraphQL */ `
  query GetUserItems($pk: String!) {
    getUserItems(pk: $pk) {
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
export const getFridgeUser = /* GraphQL */ `
  query GetFridgeUser($pk: String!) {
    getFridgeUser(pk: $pk) {
      pk
      username
      email
      name2
    }
  }
`;
export const getRecipes = /* GraphQL */ `
  query GetRecipes($input: getRecipesInput!) {
    getRecipes(input: $input) {
      name
      img
      steps
      ingredients {
        name
        amt
        __typename
      }
      calories
      __typename
    }
  }
`;
export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
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
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncItems = /* GraphQL */ `
  query SyncItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
