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
      __typename
    }
  }
`;
export const getFridgebase = /* GraphQL */ `
  query GetFridgebase($pk: String!, $sk: String!) {
    getFridgebase(pk: $pk, sk: $sk) {
      pk
      sk
      __typename
    }
  }
`;
export const listFridgebases = /* GraphQL */ `
  query ListFridgebases(
    $filter: TableFridgebaseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFridgebases(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        pk
        sk
        __typename
      }
      nextToken
      __typename
    }
  }
`;
