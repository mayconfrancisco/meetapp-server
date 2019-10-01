import Mail from '../../lib/Mail';

class MeetupSubscriptionMail {
  get key() {
    return 'MeetupSubscriptionMail';
  }

  async handle({ data }) {
    const { user, meetup } = data;

    await Mail.sendMail({
      to: `${meetup.promoter.name} <${meetup.promoter.email}>`,
      subject: `Nova inscrição no ${meetup.title}`,
      template: 'newMeetupSubscriptions',
      context: {
        promoter: meetup.promoter.name,
        meetupName: meetup.title,
        user: `${user.name} - ${user.email}`,
      },
    });
  }
}

export default new MeetupSubscriptionMail();
