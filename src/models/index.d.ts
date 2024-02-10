import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum ModelAttributeTypes {
  BINARY = "binary",
  BINARY_SET = "binarySet",
  BOOL = "bool",
  LIST = "list",
  MAP = "map",
  NUMBER = "number",
  NUMBER_SET = "numberSet",
  STRING = "string",
  STRING_SET = "stringSet",
  NULL = "_null"
}

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

type EagerFridgebase = {
  readonly pk: string;
  readonly sk: string;
}

type LazyFridgebase = {
  readonly pk: string;
  readonly sk: string;
}

export declare type Fridgebase = LazyLoading extends LazyLoadingDisabled ? EagerFridgebase : LazyFridgebase

export declare const Fridgebase: (new (init: ModelInit<Fridgebase>) => Fridgebase)

type EagerFridgebaseConnection = {
  readonly items?: (Fridgebase | null)[] | null;
  readonly nextToken?: string | null;
}

type LazyFridgebaseConnection = {
  readonly items?: (Fridgebase | null)[] | null;
  readonly nextToken?: string | null;
}

export declare type FridgebaseConnection = LazyLoading extends LazyLoadingDisabled ? EagerFridgebaseConnection : LazyFridgebaseConnection

export declare const FridgebaseConnection: (new (init: ModelInit<FridgebaseConnection>) => FridgebaseConnection)

type EagerItem = {
  readonly pk?: string | null;
  readonly sk?: string | null;
  readonly UPC?: string | null;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calories?: string | null;
  readonly img_url?: string | null;
  readonly exp_date?: number | null;
  readonly quantity?: number | null;
}

type LazyItem = {
  readonly pk?: string | null;
  readonly sk?: string | null;
  readonly UPC?: string | null;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calories?: string | null;
  readonly img_url?: string | null;
  readonly exp_date?: number | null;
  readonly quantity?: number | null;
}

export declare type Item = LazyLoading extends LazyLoadingDisabled ? EagerItem : LazyItem

export declare const Item: (new (init: ModelInit<Item>) => Item)

type EagerItems = {
  readonly pk: string;
  readonly items?: (Item | null)[] | null;
}

type LazyItems = {
  readonly pk: string;
  readonly items?: (Item | null)[] | null;
}

export declare type Items = LazyLoading extends LazyLoadingDisabled ? EagerItems : LazyItems

export declare const Items: (new (init: ModelInit<Items>) => Items)

type EagerUser = {
  readonly pk: string;
  readonly username: string;
  readonly password: string;
  readonly email: string;
}

type LazyUser = {
  readonly pk: string;
  readonly username: string;
  readonly password: string;
  readonly email: string;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User)

