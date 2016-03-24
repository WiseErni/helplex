'use strict';

const express = require('express');
const models = require('../db/models');

const router = express.Router();

router.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('running...\n');
});

router.get('/data/load/projects', (req, res, next) => {
  models.Project.findAll({
    include: {
      model: models.User,
      as: 'creator'
    }
  }).then((projects) => {
    res.json(projects);
  }).catch(next);
});

router.get('/data/load/sprints', (req, res, next) => {
  models.Sprint.findAll({
    include: {
      model: models.User,
      as: 'creator'
    }
  }).then((sprints) => {
    res.json(sprints);
  }).catch(next);
});

router.get('/data/load/tickets', (req, res, next) => {
  models.Ticket.findAll({
    include: [
      {
        model: models.User,
        as: 'creator'
      }, {
        model: models.User,
        as: 'developer'
      }
    ]
  }).then((tickets) => {
    res.json(tickets);
  }).catch(next);
});

router.get('/data/load/users', (req, res, next) => {
  models.User.findAll()
    .then((users) => {
      res.json(users);
    }).catch(next);
});

router.get('/data/load/project/:id', (req, res, next) => {
  models.Project.find({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: models.Sprint,
        as: 'sprints'
      }, {
        model: models.User,
        as: 'creator'
      }
    ]
  }).then((project) => {
    res.json(project);
  }).catch(next);
});

router.get('/data/load/sprint/:id', (req, res, next) => {
  models.Sprint.find({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: models.Ticket,
        as: 'tickets'
      }, {
        model: models.User,
        as: 'creator'
      }
    ]
  }).then((sprint) => {
    res.json(sprint);
  }).catch(next);
});

router.get('/data/load/ticket/:id', (req, res, next) => {
  models.Ticket.find({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: models.User,
        as: 'creator'
      }, {
        model: models.User,
        as: 'developer'
      }
    ]
  }).then((ticket) => {
    res.json(ticket);
  }).catch(next);
});

router.get('/data/load/user/:id', (req, res, next) => {
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then((user) => {
    res.json(user);
  }).catch(next);
});

router.post('/data/save/user/', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.User.create(req.body, {
      transaction: t
    });
  }).then((user) => {
    res.json(user);
  }).catch(next);
});

router.post('/data/save/project/', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Project.create(req.body, {
      transaction: t
    });
  }).then((project) => {
    res.json(project);
  }).catch(next);
});

router.post('/data/save/sprint', (req, res, next) => {
  let root;
  let tickets = [];

  models.sequelize.transaction((t) => {
    return models.Sprint.create(req.body.root || {}, {
      transaction: t
    }).then((sprint) => {
      root = sprint.id;

      if (req.body.tickets.added) {
        return req.body.tickets.added.map((data) => {
          return () => {
            return models.Ticket.create(Object.assign({}, data, {
              sprint_id: root
            }), {
              transaction: t
            }).then((ticket) => {
              tickets.push(ticket.id);
            });
          };
        }).reduce((a, b) => {
          return a.then(b);
        }, Promise.resolve());
      }
    });
  }).then(() => {
    res.json({
      root, tickets
    });
  }).catch(next);
});

router.post('/data/save/ticket', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Ticket.create(req.body, {
      transaction: t
    });
  }).then((ticket) => {
    res.json(ticket);
  }).catch(next);
});

router.post('/data/save/user/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.User.update(req.body, {
      where: {
        id: req.params.id
      },
      transaction: t
    });
  })
  .then(() => {
    res.json();
  }).catch(next);
});

router.post('/data/save/project/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Project.update(req.body, {
      where: {
        id: req.params.id
      },
      transaction: t
    });
  }).then(() => {
    res.json();
  }).catch(next);
});

router.post('/data/save/sprint/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Sprint.update(req.body.root || {}, {
      where: {
        id: req.params.id
      },
      transaction: t
    }).then(() => {
      let ids = [];
      let actions = [];

      if (req.body.tickets.removed) {
        actions.push(() => {
          return models.Ticket.destroy({
            where: {
              id: [req.body.tickets.removed]
            },
            transaction: t
          });
        });
      }

      if (req.body.tickets.added) {
        actions = actions.concat(req.body.tickets.added.map((data, index) => {
          return () => {
            return models.Ticket.create(data, {
              transaction: t
            }).then((ticket) => {
              ids[index] = ticket.id;
            });
          };
        }));
      }

      if (req.body.tickets.updated) {
        actions = actions.concat(req.body.tickets.updated.map((data) => {
          return () => {
            return models.Ticket.update(data, {
              where: {
                id: data.id
              },
              transaction: t
            });
          };
        }));
      }

      return actions.reduce((a, b) => {
        return a.then(b);
      }, Promise.resolve()).then(() => {
        return {
          tickets: {
            added: ids
          }
        };
      });
    });
  }).then((result) => {
    res.json(result);
  }).catch(next);
});

router.post('/data/save/ticket/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Ticket.update(req.body, {
      where: {
        id: req.params.id
      },
      transaction: t
    });
  })
  .then((id) => {
    res.json(id);
  }).catch(next);
});

router.post('/data/delete/project/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Project.destroy({
      where: {
        id: req.params.id
      },
      transaction: t
    });
  }).then((count) => {
    res.json(count);
  }).catch(next);
});

router.post('/data/delete/sprint/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Sprint.destroy({
      where: {
        id: req.params.id
      },
      transaction: t
    });
  }).then((count) => {
    res.json(count);
  }).catch(next);
});

router.post('/data/delete/ticket/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Ticket.destroy({
      where: {
        id: req.params.id
      },
      transaction: t
    });
  }).then((count) => {
    res.json(count);
  }).catch(next);
});

router.post('/data/delete/user/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.User.destroy({
      where: {
        id: req.params.id
      },
      transaction: t
    });
  }).then((count) => {
    res.json(count);
  }).catch(next);
});

module.exports = router;
