/*eslint-env mocha */
'use strict';
process.env.NODE_ENV = 'test';

// eslint-disable-next-line
const should = require('should');
const request = require('supertest-as-promised');
const server = require('../src/server.js');
const models = require('../src/db/models');

const PORT = 3456;

const agent = request.agent('http://localhost:' + PORT);
server.listen(PORT);

describe('loading', function () {
  it('should return 200', function () {
    return agent
      .get('/')
      .then((res) => {
        res.status.should.be.equal(200);
        res.text.should.be.equal('running...\n');
      });
  });

  it ('should return users', function () {
    return agent
      .get('/data/load/users/')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(9);
        res.body[0].name.should.be.equal('admin');
        res.body[4].name.should.be.equal('Илья Першин');
      });
  });

  it ('should return user with id=3', function () {
    return agent
      .get('/data/load/user/3')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.role.should.be.equal('manager');
        res.body.email.should.be.equal('julia@server.com');
      });
  });

  it ('should return projects', function () {
    return agent
      .get('/data/load/projects')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(3);
        res.body[0].title.should.be.equal('Project 1');
        res.body[1].title.should.be.equal('test test');
        res.body[2].title.should.be.equal('empty project');
        res.body[0].creator.name.should.be.equal('admin');
      });
  });

  it ('should return project with id=1', function () {
    return agent
      .get('/data/load/project/1')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.title.should.be.ok();
        res.body.title.should.be.equal('Project 1');
        res.body.sprints.length.should.be.equal(10);
        res.body.sprints[0].title.should.be.equal('1-1');
        res.body.creator.name.should.be.equal('admin');
      });
  });

  it ('should return sprints', function () {
    return agent
      .get('/data/load/sprints/')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(10);
        res.body[0].title.should.be.equal('1-1');
        res.body[8].title.should.be.equal('1-9');
        res.body[0].creator.name.should.be.equal('admin');
      });
  });

  it ('should return sprint with id=5', function () {
    return agent
      .get('/data/load/sprint/5')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.title.should.be.equal('1-5');
        res.body.description.should.be.equal('короткий спринт (8 марта)');
        res.body.tickets.length.should.be.equal(12);
        res.body.tickets[6].title.should.be.equal('Серая область в методе выделения в гриде Standard');
        res.body.creator.name.should.be.equal('admin');
      });
  });

  it ('should return tickets', function () {
    return agent
      .get('/data/load/tickets/')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(12);
        res.body[0].title.should.be.equal('Разработка инструкции по разработке модуля на примере домашней бухгалтерии');
        res.body[0].creator.name.should.be.equal('Айрат Галямов');
        res.body[10].title.should.be.equal('Сброс сортировки в гриде реестров');
        res.body[10].creator.email.should.be.equal('murtasin@server.com');
      });
  });

  it('should return ticket with id=2', function () {
    return agent
      .get('/data/load/ticket/2')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.title.should.be.equal('Перенос инструкций на внешнюю вики');
        res.body.creator.name.should.be.equal('Айрат Галямов');
        res.body.developer.name.should.be.equal('Айрат Галямов');
      });
  });
});

describe('saving', function () {
  it('should create new user', function () {
    return agent
      .post('/data/save/user')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Rick Sanches',
        email: 'rick@sick.com',
        role: 'developer'
      })
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        return models.User.findById(res.body.id).then((user) => {
          user.name.should.be.equal('Rick Sanches');
        });
      });
  });

  it('should create new project', function () {
    return agent
      .post('/data/save/project')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Sample project',
        creator_id: 1
      })
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        return models.Project.findById(res.body.id).then((project) => {
          project.title.should.be.equal('Sample project');
        });
      });
  });

  it('should create new sprint', function () {
    return agent
      .post('/data/save/sprint')
      .set('Content-Type', 'application/json')
      .send({
        title: '1-x',
        creator_id: 1,
        project_id: 1,
        tickets: [
          {
            title: 'test ticket',
            project_id: 1
          }, {
            title: 'simple ticket',
            project_id: 1
          }, {
            title: 'new ticket',
            project_id: 1
          }
        ]
      })
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        return models.Sprint.find({
          where: {
            id: res.body.id
          },
          include: [
            {
              model: models.Ticket,
              as: 'tickets'
            }
          ]
        }).then((sprint) => {
          sprint.title.should.be.equal('1-x');
          sprint.tickets.length.should.be.equal(3);
          sprint.tickets[0].title.should.be.equal('test ticket');
          sprint.tickets[1].title.should.be.equal('simple ticket');
          sprint.tickets[2].title.should.be.equal('new ticket');
        });
      });
  });

  it('should create new ticket', function () {
    return agent
      .post('/data/save/ticket')
      .set('Content-Type', 'application/json')
      .send({
        title: 'create new ticket',
        creator_id: 1,
        project_id: 2
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.Ticket.find({
          where: {
            id: res.body.id
          }
        }).then((ticket) => {
          ticket.title.should.be.equal('create new ticket');
        });
      });
  });

  it('should update user with id=1', function () {
    return agent
      .post('/data/save/user/1')
      .set('Content-Type', 'application/json')
      .send({
        name: 'admin 123',
        email: 'e@mail'
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.User.findById(1).then((user) => {
          user.name.should.be.equal('admin 123');
          user.email.should.be.equal('e@mail');
        });
      });
  });

  it('should update project with id=3', function () {
    return agent
      .post('/data/save/project/3')
      .set('Content-Type', 'application/json')
      .send({
        title: 'project 42'
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.Project.findById(3).then((project) => {
          project.title.should.be.equal('project 42');
        });
      });
  });

  it('should update sprint with id=5 and 2 deleted tickets', function () {
    return agent
      .post('/data/save/sprint/5')
      .set('Content-Type', 'application/json')
      .send({
        tickets: {
          removed: [1, 3]
        }
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.Ticket.findAll({
          where: {
            id: [1, 3]
          }
        }).then((x) => {
          x.length.should.be.not.ok();
        });
      });
  });

  it('should update sprint with id=5 and 3 added tickets', function () {
    return agent
      .post('/data/save/sprint/5')
      .set('Content-Type', 'application/json')
      .send({
        tickets: {
          added: [
            {
              title: 'added ticket 1',
              raiting: 2,
              sprint_id: 5,
              project_id: 1
            }, {
              title: 'ticket 2',
              raiting: 10,
              sprint_id: 5,
              project_id: 1
            }, {
              title: 'ticket ticket 3',
              raiting: 5,
              sprint_id: 5,
              project_id: 1
            }
          ]
        }
      })
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.tickets.added.length.should.be.equal(3);

        return models.Ticket.findAll({
          attributes: ['title'],
          where: {
            id: res.body.tickets.added
          }
        }).then((tickets) => {
          tickets[0].title.should.be.equal('added ticket 1');
          tickets[1].title.should.be.equal('ticket 2');
          tickets[2].title.should.be.equal('ticket ticket 3');
        });
      });
  });

  it('should update sprint with id=5 and 2 updated tickets', function () {
    return agent
      .post('/data/save/sprint/5')
      .set('Content-Type', 'application/json')
      .send({
        tickets: {
          updated: [
            {
              id: 4,
              title: 'date selection error!',
              description: ''
            }, {
              id: 8,
              title: 'signalr'
            }
          ]
        }
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return Promise.all([
          models.Ticket.findById(4).then((ticket) => {
            ticket.title.should.be.equal('date selection error!');
            ticket.description.should.be.equal('');
          }),
          models.Ticket.findById(8).then((ticket) => {
            ticket.title.should.be.equal('signalr');
          })
        ]);
      });
  });

  it('should update sprint with id=5, added, updated, deleted tickets', function () {
    return agent
      .post('/data/save/sprint/5')
      .set('Content-Type', 'application/json')
      .send({
        root: {
          title: 'sprint 5 updated'
        },
        tickets: {
          added: [
            {
              title: '22.03',
              sprint_id: 5,
              project_id: 1
            }, {
              title: 'deep down below',
              sprint_id: 5,
              project_id: 1
            }, {
              title: 'liquid stranger',
              sprint_id: 5,
              project_id: 1
            }
          ],
          updated: [
            {
              id: 4,
              title: 'date error',
              description: ''
            }, {
              id: 8,
              title: 'to signalr or not to signalr?'
            }
          ],
          removed: [7, 10]
        }
      })
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.tickets.added.length.should.be.equal(3);

        return Promise.all([
          models.Sprint.findById(5).then((sprint) => {
            sprint.title.should.be.equal('sprint 5 updated');
          }),
          models.Ticket.findAll({
            attributes: ['title'],
            where: {
              id: res.body.tickets.added
            }
          }).then((tickets) => {
            tickets[0].title.should.be.equal('22.03');
            tickets[1].title.should.be.equal('deep down below');
            tickets[2].title.should.be.equal('liquid stranger');
          })
        ]);
      });
  });

  it('should update ticket with id=5', function () {
    return agent
      .post('/data/save/ticket/5')
      .set('Content-Type', 'application/json')
      .send({
        title: 'messenger: back-end',
        status: 'testing'
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.Ticket.findById(5).then((ticket) => {
          ticket.title.should.be.equal('messenger: back-end');
          ticket.status.should.be.equal('testing');
        });
      });
  });
});

describe('deleting', function () {

});
