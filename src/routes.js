import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscribeMeetupController from './app/controllers/SubscribeMeetupController';
import OrganizingController from './app/controllers/OrganizingController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetups/:meetupId', MeetupController.index);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetupId', MeetupController.update);
routes.delete('/meetups/:meetupId', MeetupController.delete);

routes.post('/meetups/:meetupId/subscribe', SubscribeMeetupController.store);
routes.get('/subscriptions', SubscribeMeetupController.index);

routes.get('/organizing', OrganizingController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
