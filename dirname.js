import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Function to mimic __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);
