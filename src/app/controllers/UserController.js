import User from '../models/User';

class UserController {
  /**
   *
   * Criar usuario
   *
   */
  async store(req, resp) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return resp.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return resp.json({ id, name, email });
  }

  /**
   *
   * Atualizar usuario
   *
   */
  async update(req, resp) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return resp.status(400).json({ error: 'Email already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return resp.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return resp.json({ id, name, email });
  }
}

export default new UserController();
