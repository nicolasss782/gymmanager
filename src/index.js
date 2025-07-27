// src/index.js
import expressLayouts from 'express-ejs-layouts';
import express from 'express';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import subRoutes from './routes/subscriptions.js';
import dashRoutes from './routes/dashboard.js';
import { ensureAuth } from './middleware/auth.js';
import './cron/reminders.js';

const app = express();
const SQLiteStore = SQLiteStoreFactory(session);

app.set('view engine','ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'..','public')));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname,'..') }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60*24 }
}));

// Variabili sempre disponibili nei template
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.error = null;
  res.locals.success = null;
  next();
});

app.use(authRoutes);
app.use('/', dashRoutes);
app.use('/members', ensureAuth, memberRoutes);
app.use('/subscriptions', ensureAuth, subRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

