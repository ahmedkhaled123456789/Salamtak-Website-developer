import type { CareApi } from '../types/api';
import { config } from './config';
import { demoAdapter } from './demoAdapter';
import { liveAdapter } from './liveAdapter';

/** `VITE_DATA_SOURCE=live` talks to care-backend; anything else serves the bundled demo content. */
export const careApi: CareApi = config.dataSource === 'live' ? liveAdapter : demoAdapter;
