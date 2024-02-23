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
  mutation AddItemByUPC($uid: String!, $upc: String!) {
    addItemByUPC(uid: $uid, upc: $upc) {
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
