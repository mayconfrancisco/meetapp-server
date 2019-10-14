import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
  async index(req, resp) {
    // Retorna todos - inclusive os passados
    const meetups = await Meetup.findAll({
      where: { promoter_id: req.userId },
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['url', 'path'],
        },
      ],
    });

    return resp.json(meetups);
  }
}

export default new OrganizingController();
