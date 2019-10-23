import { isAfter } from 'date-fns';
import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import MeetupSubscriptionMail from '../jobs/MeetupSubscriptionMail';

import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import File from '../models/File';

class SubscribeMeetupController {
  async index(req, resp) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          include: [
            {
              model: File,
              as: 'banner',
              attributes: ['url', 'path'],
            },
            {
              model: User,
              as: 'promoter',
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [[Meetup, 'date']],
    });

    return resp.json(subscriptions);
  }

  async store(req, resp) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId, {
      include: [
        {
          model: User,
          as: 'promoter',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (req.userId === meetup.promoter_id) {
      return resp.status(400).json({
        erro: 'You cannot sign up for a meeting where you are the organizer.',
      });
    }

    if (isAfter(new Date(), meetup.date)) {
      return resp
        .status(400)
        .json({ error: 'Unable to sign up for past meetings' });
    }

    const checkDateSub = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    // Nao sera possivel se cadastrar no mesmo meetup 2x pq ele bate no mesmo horario
    // TODO - implementar futuramente previsao de termino do meetup e verificar janela de horarios
    if (checkDateSub) {
      return resp
        .status(400)
        .json({ erro: "Can't subscribe to two meetups at the same time" });
    }

    const subscriptions = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetupId,
    });

    const user = await User.findByPk(req.userId);

    Queue.add(MeetupSubscriptionMail.key, { meetup, user });

    return resp.json(subscriptions);
  }
}

export default new SubscribeMeetupController();
