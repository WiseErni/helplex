'use strict';

const express = require('express');
const normalizr = require('normalizr');
const models = require('../db/models');

const router = express.Router();

const normalize = (data, schema) => {
  return normalizr.normalize(data, schema, {
    assignEntity: (obj, key, val) => {
      obj[key] = val;
      delete obj[key + '_id'];
    }
  });
};

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
    const project = new normalizr.Schema('projects');
    const user = new normalizr.Schema('users');
    project.define({
      creator: user
    });

    res.json(normalize(projects.map((x) => {
      return x.toJSON();
    }), normalizr.arrayOf(project)));
  }).catch(next);
});

router.get('/data/load/sprints', (req, res, next) => {
  const sprint = new normalizr.Schema('sprints');
  const user = new normalizr.Schema('users');
  sprint.define({
    creator: user
  });

  models.Sprint.findAll({
    include: {
      model: models.User,
      as: 'creator'
    }
  }).then((result) => {
    res.json(normalize(result.map((x) => {
      return x.toJSON();
    }), normalizr.arrayOf(sprint)));
  }).catch(next);
});

router.get('/data/load/tickets', (req, res, next) => {
  const ticket = new normalizr.Schema('tickets');
  const user = new normalizr.Schema('users');
  ticket.define({
    creator: user,
    developer: user
  });

  models.Ticket.findAll({
    include: [{
      model: models.User,
      as: 'creator'
    }, {
      model: models.User,
      as: 'developer'
    }]
  }).then((result) => {
    res.json(normalize(result.map((x) => {
      return x.toJSON();
    }), normalizr.arrayOf(ticket)));
  }).catch(next);
});

router.get('/data/load/users', (req, res, next) => {
  const user = new normalizr.Schema('users');
  models.User.findAll()
    .then((users) => {
      res.json(normalize(users.map((x) => {
        return x.toJSON();
      }), normalizr.arrayOf(user)));
    }).catch(next);
});

router.get('/data/load/contracts', (req, res, next) => {
  const contract = new normalizr.Schema('contracts');
  const user = new normalizr.Schema('users');
  contract.define({
    developer: user
  });
  models.Contract.findAll({
    include: [{
      model: models.User,
      as: 'developer'
    }]
  }).then((contracts) => {
    res.json(normalize(contracts.map((x) => {
      return x.toJSON();
    }), normalizr.arrayOf(contract)));
  }).catch(next);
});

router.get('/data/load/project/:id', (req, res, next) => {
  const project = new normalizr.Schema('projects');
  const sprint = new normalizr.Schema('sprints');
  const user = new normalizr.Schema('users');
  project.define({
    sprints: normalizr.arrayOf(sprint),
    creator: user
  });
  sprint.define({
    creator: user
  });

  models.Project.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Sprint,
      as: 'sprints'
    }, {
      model: models.User,
      as: 'creator'
    }]
  }).then((result) => {
    if (!result) {
      throw new Error(`Can't load project with id=${req.params.id}`);
    }

    res.json(normalize(result.toJSON(), project));
  }).catch(next);
});

router.get('/data/load/sprint/:id', (req, res, next) => {
  const sprint = new normalizr.Schema('sprints');
  const ticket = new normalizr.Schema('tickets');
  const user = new normalizr.Schema('users');
  const contract = new normalizr.Schema('contracts');
  sprint.define({
    tickets: normalizr.arrayOf(ticket),
    contracts: normalizr.arrayOf(contract),
    creator: user
  });
  ticket.define({
    creator: user,
    developer: user
  });

  contract.define({
    developer: user
  });

  models.Sprint.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Ticket,
      as: 'tickets',
      include: [{
        model: models.User,
        as: 'creator'
      }, {
        model: models.User,
        as: 'developer'
      }]
    }, {
      model: models.User,
      as: 'creator'
    }, {
      model: models.Contract,
      as: 'contracts',
      include: [{
        model: models.User,
        as: 'developer'
      }]
    }]
  }).then((result) => {
    if (!result) {
      throw new Error(`Can't load sprint with id=${req.params.id}`);
    }

    res.json(normalize(result.toJSON(), sprint));
  }).catch(next);
});

router.get('/data/load/ticket/:id', (req, res, next) => {
  const ticket = new normalizr.Schema('tickets');
  const user = new normalizr.Schema('users');
  ticket.define({
    creator: user,
    developer: user
  });

  models.Ticket.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.User,
      as: 'creator'
    }, {
      model: models.User,
      as: 'developer'
    }]
  }).then((result) => {
    if (!result) {
      throw new Error(`Can't load ticket with id=${req.params.id}`);
    }

    res.json(normalize(result.toJSON(), ticket));
  }).catch(next);
});

router.get('/data/load/user/:id', (req, res, next) => {
  const user = new normalizr.Schema('users');
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then((result) => {
    if (!result) {
      throw new Error(`Can't load user with id=${req.params.id}`);
    }

    res.json(normalize(result.toJSON(), user));
  }).catch(next);
});

router.get('/data/load/contract/:id', (req, res, next) => {
  const contract = new normalizr.Schema('contracts');
  const user = new normalizr.Schema('users');
  contract.define({
    developer: user
  });
  models.Contract.find({
    where: {
      id: req.params.id
    },
    include: {
      model: models.User,
      as: 'developer'
    }
  }).then((result) => {
    if (!result) {
      throw new Error(`Can't load contract with id=${req.params.id}`);
    }

    res.json(normalize(result.toJSON(), contract));
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
  let contracts = [];
  models.sequelize.transaction((t) => {
    return models.Sprint.create(req.body.root || {}, {
      transaction: t
    }).then((sprint) => {
      let actions = [];
      root = sprint.id;

      if (req.body.tickets.added) {
        actions = actions.concat(req.body.tickets.added.map((data) => {
          return () => {
            return models.Ticket.create(Object.assign({}, data, {
              sprint_id: root
            }), {
              transaction: t
            }).then((ticket) => {
              tickets.push(ticket.id);
            });
          };
        }));
      }

      if (req.body.contracts.added) {
        actions = actions.concat(req.body.contracts.added.map((data) => {
          return () => {
            return models.Contract.create(Object.assign({}, data, {
              sprint_id: root
            }), {
              transaction: t
            }).then((contract) => {
              contracts.push(contract.id);
            });
          };
        }));
      }

      return actions.reduce((a, b) => {
        return a.then(b);
      }, Promise.resolve());
    });
  }).then(() => {
    res.json({
      root,
      tickets,
      contracts
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

router.post('/data/save/contract', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Contract.create(req.body, {
      transaction: t
    });
  }).then((contract) => {
    res.json(contract);
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
      let tiketsIds = [];
      let contractsIds = [];
      let actions = [];

      if(req.body.tickets){
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
                tiketsIds[index] = ticket.id;
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
      }

      if (req.body.contracts){
        if (req.body.contracts.removed) {
          actions.push(() => {
            return models.Contract.destroy({
              where: {
                id: [req.body.contracts.removed]
              },
              transaction: t
            });
          });
        }

        if (req.body.contracts.added) {
          actions = actions.concat(req.body.contracts.added.map((data, index) => {
            return () => {
              return models.Contract.create(data, {
                transaction: t
              }).then((contract) => {
                contractsIds[index] = contract.id;
              });
            };
          }));
        }

        if (req.body.contracts.updated) {
          actions = actions.concat(req.body.contracts.updated.map((data) => {
            return () => {
              return models.Contract.update(data, {
                where: {
                  id: data.id
                },
                transaction: t
              });
            };
          }));
        }
      }

      return actions.reduce((a, b) => {
        return a.then(b);
      }, Promise.resolve()).then(() => {
        return {
          tickets: {
            added: tiketsIds
          },
          contracts: {
            added: contractsIds
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

router.post('/data/save/contract/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
      return models.Contract.update(req.body, {
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

router.post('/data/delete/contract/:id', (req, res, next) => {
  models.sequelize.transaction((t) => {
    return models.Contract.destroy({
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
