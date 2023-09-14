const user = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about } = req.body;

  user.create({ name, about })
    // eslint-disable-next-line no-shadow
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
