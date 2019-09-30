import * as Yup from 'yup';
import { isBefore, parseISO, isAfter } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
  /**
   * Add Meetup
   *
   */
  async store(req, resp) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'Validation fails' });
    }

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

    return resp.json(meetup);
  }

  /**
   * Update Meetup
   *
   */
  async update(req, resp) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
      promoter_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'Validation fails' });
    }

    // TODO - Como validar os params e os queryparams?
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
    // Retorna todos - inclusive os passados
    const meetups = await Meetup.findAll({
      where: { promoter_id: req.userId },
    });

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
