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

router.get('/data/load/projects', (req, res) => {
  models.Project.findAll({
    include: {
      model: models.User,
      as: 'creator'
    }
  }).then((projects) => {
    res.json(projects);
  });
});

router.get('/data/load/sprints', (req, res) => {
  models.Sprint.findAll({
    include: {
      model: models.User,
      as: 'creator'
    }
  }).then((sprints) => {
    res.json(sprints);
  });
});

router.get('/data/load/tickets', (req, res) => {
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
  });
});

router.get('/data/load/users', (req, res) => {
  models.User.findAll().then((users) => {
    res.json(users);
  });
});

router.get('/data/load/project/:id', (req, res) => {
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
  });
});

router.get('/data/load/sprint/:id', (req, res) => {
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
  });
});

router.get('/data/load/ticket/:id', (req, res) => {
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
  });
});

router.get('/data/load/user/:id', (req, res) => {
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then((user) => {
    res.json(user);
  });
});

router.post('/data/save/user/', (req, res) => {
  models.User.create(req.body).then((user) => {
    res.json(user);
  });
});

router.post('/data/save/project/', (req, res) => {
  models.Project.create(req.body).then((project) => {
    res.json(project);
  });
});

router.post('/data/save/sprint', (req, res) => {
  models.Sprint.create(req.body, {
    include: [
      {
        model: models.Ticket,
        as: 'tickets'
      }
    ]
  }).then((sprint) => {
    res.json(sprint);
  });
});

router.post('/data/save/ticket', (req, res) => {
  models.Ticket.create(req.body)
    .then((ticket) => {
      res.json(ticket);
    });
});

router.post('/data/save/user/:id', (req, res) => {
  models.User.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then((id) => {
    res.json(id);
  });
});

router.post('/data/save/project/:id', (req, res) => {
  models.Project.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.json();
  });
});

router.post('/data/save/sprint/:id', (req, res) => {
  models.Sprint.update(req.body.root || {}, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    let ids = [];
    let promises = [];

    if (req.body.tickets.removed) {
      promises.push(models.Ticket.destroy({
        where: {
          id: [req.body.tickets.removed]
        }
      }));
    }

    if (req.body.tickets.added) {
      promises.push(Promise.all(req.body.tickets.added.map((data, index) => {
        return models.Ticket.create(data).then((ticket) => {
          ids[index] = ticket.id;
        });
      })));
    }

    if (req.body.tickets.updated) {
      promises.push(Promise.all(req.body.tickets.updated.map((data) => {
        return models.Ticket.update(data, {
          where: {
            id: data.id
          }
        });
      })));
    }

    Promise.all(promises).then(() => {
      res.json({
        tickets: {
          added: ids
        }
      });
    });
  });
});

router.post('/data/save/ticket/:id', (req, res) => {
  models.Ticket.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then((id) => {
    res.json(id);
  });
});

router.get('/data/load/test/', (req, res) => {
  models.Project.find({
    where: {
      id: 1
    },
    include: [
      {
        model: models.Sprint,
        as: 'sprints'
      }, {
        model: models.Ticket,
        as: 'tickets',
        include: [
          {
            model: models.User,
            as: 'creator'
          }
        ]
      }
    ]
  }).then((project) => {
    res.json(project);
  });
});

module.exports = router;
