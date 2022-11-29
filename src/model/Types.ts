import {Characteristics} from "./Characteristics";

export type User = {
  id: string;
  name: string;
};

export type SpecialRule = {
  id: string;
  name: string;
};

export type Trait = {
  id: string;
  name: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type TeamPreview = {
  id: string;
  name: string;
  faction: string;
  rating: number;
  creatorNickname: string;
  time: string;
};

export type WeaponUpgrade = {
  id: string;
  name: string;
};

export type MyTeamPreview = {
  name: string;
  faction: string;
};

export type Injury = {
  id: string;
  name: string;
  characteristicsMods: Characteristics;
};

export type Advance = {
  id: string;
  name: string;
  characteristicsMods: Characteristics;
};

export type WeaponProfile = {
  name: string | null;
  isMelee: boolean;
  sr: number | null;
  lr: number | null;
  sm: number | null;
  lm: number | null;
  s: number | null;
  ap: number | null;
  d: number | null;
  am: number | null;
  traits: Trait[];
};

export type Weapon = {
  id: string;
  name: string;
  profiles: WeaponProfile[];
  upgrades: WeaponUpgrade[];
  cost: number;
  rarity: number | null;
  availibleOnTraidingPost: boolean;
};

export type Equipment = {
  id: string | null;
  name: string;
  rarity: number | null;
  cost: number;
};

export enum Status {
  ACTIVE,
  DEAD,
  ON_RECOVERY
}

export type FighterView = {
  id: string;
  name: string;
  rang: string;
  totalCharacteristics: Characteristics;
  weapons: Weapon[];
  equipment: Equipment[];
  skills: Skill[];
  status: Status;
  totalCost: number;
  xp: number;
};
