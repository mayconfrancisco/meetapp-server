import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscribeMeetupController from './app/controllers/SubscribeMeetupController';
import OrganizingController from './app/controllers/OrganizingController';

import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);

routes.get('/meetups/:meetupId', MeetupController.index);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', validateMeetupStore, MeetupController.store);
routes.put('/meetups/:meetupId', validateMeetupUpdate, MeetupController.update);
routes.delete('/meetups/:meetupId', MeetupController.delete);

routes.post('/meetups/:meetupId/subscribe', SubscribeMeetupController.store);
routes.get('/subscriptions', SubscribeMeetupController.index);
routes.delete('/subscriptions/:subscribeId', SubscribeMeetupController.delete);

routes.get('/organizing', OrganizingController.index);
routes.get('/organizing/:meetupId', OrganizingController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
