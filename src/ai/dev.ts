import { config } from 'dotenv';
config();

import '@/ai/flows/process-lottery-results.ts';
import '@/ai/flows/submit-application.ts';
import '@/ai/flows/get-status.ts';
import '@/ai/flows/send-notification.ts';
