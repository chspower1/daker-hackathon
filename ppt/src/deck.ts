import type { ComponentType } from 'react';
import { Slide01 } from './slides/Slide01';
import { Slide02 } from './slides/Slide02';
import { Slide03 } from './slides/Slide03';
import { Slide04 } from './slides/Slide04';
import { Slide05 } from './slides/Slide05';
import { Slide06 } from './slides/Slide06';

export const STAGE_WIDTH = 1400;
export const STAGE_HEIGHT = 800;
export const DECK_EXPORT_PARAM = 'export';

export const SLIDES: ComponentType[] = [
  Slide01,
  Slide02,
  Slide03,
  Slide04,
  Slide05,
  Slide06,
];

export const SLIDE_COUNT = SLIDES.length;
