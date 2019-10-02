import Meetup from '../models/Meetup';

class OrganizingController {
  async index(req, resp) {
    // Retorna todos - inclusive os passados
    const meetups = await Meetup.findAll({
      where: { promoter_id: req.userId },
    });

    return resp.json(meetups);
  }
}

export default new OrganizingController();
