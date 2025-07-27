import { sendEmail } from '../utils/email.js';

await sendEmail('nicolasirritato8@gmail.com', 'Test Email ✅', 'Funziona!');
console.log('Fatto');
process.exit(0);
