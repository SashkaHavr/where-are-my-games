import type { ReactNode } from 'react';

import type { TRPCInput } from '@where-are-my-games/trpc';

import {
  EAIcon,
  EpicGamesStoreIcon,
  GOGIcon,
  MSStoreIcon,
  NintendoSwitchIcon,
  PlaystationIcon,
  SteamIcon,
  UbisoftIcon,
  XboxIcon,
} from './icons';

export interface GamePlatform {
  text: string;
  key: TRPCInput['games']['setPlatforms']['platforms'][number];
  icon: () => ReactNode;
}

export const gamePlatforms: GamePlatform[] = [
  {
    text: 'Xbox',
    key: 'xbox',
    icon: XboxIcon,
  },
  {
    text: 'Nintendo Switch',
    key: 'switch',
    icon: NintendoSwitchIcon,
  },
  {
    text: 'Playstation',
    key: 'ps',
    icon: PlaystationIcon,
  },
  {
    text: 'Steam',
    key: 'steam',
    icon: SteamIcon,
  },
  {
    text: 'Epic Games Store',
    key: 'egs',
    icon: EpicGamesStoreIcon,
  },
  {
    text: 'GOG',
    key: 'gog',
    icon: GOGIcon,
  },
  {
    text: 'Ubisoft',
    key: 'ubisoft',
    icon: UbisoftIcon,
  },
  {
    text: 'EA',
    key: 'ea',
    icon: EAIcon,
  },
  {
    text: 'Microsoft Store',
    key: 'msstore',
    icon: MSStoreIcon,
  },
];
