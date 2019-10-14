import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
  async index(req, resp) {
    const { meetupId } = req.params;

    const where = { promoter_id: req.userId };
    let attributes = null;
    const include = [];

    if (meetupId) {
      where.id = meetupId;

      include.push({
        model: File,
        as: 'banner',
        attributes: ['url', 'path'],
      });
    } else {
      attributes = ['id', 'title', 'date'];
    }

    // Retorna todos - inclusive os passados
    const meetups = await Meetup.findAll({
      where,
      attributes,
      include,
    });

    return resp.json(meetups);
  }
}

export default new OrganizingController();
