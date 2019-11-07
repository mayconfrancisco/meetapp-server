import { isBefore, parseISO, isAfter, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class MeetupController {
  /**
   * Add Meetup
   */
  async store(req, resp) {
    const { date, title, description, location, banner_id } = req.body;
    const dateMeetup = parseISO(date);

    if (isBefore(dateMeetup, new Date())) {
      return resp.status(400).json({ error: 'Only future dates are allowed.' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date: dateMeetup,
      banner_id,
      promoter_id: req.userId,
    });

    await Cache.invalidatePrefix('meetups');

    return resp.json(meetup);
  }

  /**
   * Update Meetup
   *
   */
  async update(req, resp) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

    const { promoter_id, date: meetupDate } = meetup;

    if (promoter_id !== req.userId) {
      return resp
        .status(400)
        .json({ error: 'You can only edit meetups that you are the promoter' });
    }

    if (isAfter(new Date(), meetupDate)) {
      return resp
        .status(400)
        .json({ error: "can't edit already performed meetups" });
    }

    const { date: newMeetupDate } = req.body;
    if (isBefore(parseISO(newMeetupDate), new Date())) {
      return resp.status(400).json({ error: 'Only future dates are allowed.' });
    }

    await meetup.update(req.body);

    return resp.json(meetup);
  }

  /**
   * List Meetup
   *
   */
  async index(req, resp) {
    const { date, page = 1 } = req.query;
    const { meetupId } = req.params;
    const where = {};
    let cacheKey = `meetups:page:${page}`;

    if (date) {
      const dateFilter = parseISO(date);
      where.date = {
        [Op.between]: [startOfDay(dateFilter), endOfDay(dateFilter)],
      };
      cacheKey += `:date:${dateFilter.getTime}`;
    }

    if (meetupId) {
      where.id = meetupId;
      cacheKey += `:meetupId:${meetupId}`;
    }

    const cached = await Cache.get(cacheKey);
    if (cached) {
      return resp.json(cached);
    }

    const meetups = await Meetup.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      where,
      include: [
        {
          model: User,
          as: 'promoter',
        },
        {
          model: File,
          as: 'banner',
          attributes: ['url', 'path'],
        },
      ],
    });

    await Cache.set(cacheKey, meetups);

    return resp.json(meetups);
  }

  /**
   * Delete Meetup
   *
   */
  async delete(req, resp) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

    const { promoter_id, date: meetupDate } = meetup;

    if (promoter_id !== req.userId) {
      return resp.status(400).json({
        error: 'You can only cancel meetups that you are the promoter',
      });
    }

    if (isAfter(new Date(), meetupDate)) {
      return resp
        .status(400)
        .json({ error: "can't cancel already performed meetups" });
    }

    meetup.destroy();

    return resp.send();
  }
}

export default new MeetupController();
