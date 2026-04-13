import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { CipherKey } from 'crypto';

import { clientUrl, mongoUri, serverUrl } from './configs';
import initializePassport from './auth/initializePassport';
import initializeRoutes from './routes';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { app, server } from './socket/socket';
dotenv.config();

// Trust Vercel's proxy so secure cookies and req.protocol work correctly
app.set('trust proxy', 1);

(async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
})();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin == clientUrl || origin == serverUrl) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Baan Saat API',
      version: '1.0.0',
      description: 'API documentation for Baan Saat',
    },
  },
  apis: ['./src/**/*Routes.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const store = MongoStore.create({
  mongoUrl: mongoUri,
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (14 days)
});

app.use(
  session({
    secret: process.env.SESSION_SECRET as CipherKey,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      // Cookie expiration in milliseconds (e.g., 7 days)
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true, // Prevent XSS attacks
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.use(express.json());

initializeRoutes(app);

if (!process.env.VERCEL) {
  server.listen(process.env.PORT, () =>
    console.log(
      `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
    ),
  );
}

export default app;
