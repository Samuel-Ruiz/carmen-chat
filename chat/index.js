process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import {API} from './src/api.js';
import dotenv from 'dotenv';

dotenv.config();

const api = new API(3000);
