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
  it('should return 200 and text "running..."', function () {
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
        Object.keys(res.body.entities.users).length.should.be.equal(9);
        res.body.entities.users['1'].name.should.be.equal('admin');
        res.body.entities.users['5'].name.should.be.equal('Илья Першин');
      });
  });

  it ('should return user with id=3', function () {
    return agent
      .get('/data/load/user/3')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.entities.users['3'].role.should.be.equal('manager');
        res.body.entities.users['3'].email.should.be.equal('julia@server.com');
      });
  });

  it ('should return projects', function () {
    return agent
      .get('/data/load/projects')
      .then((res) => {
        res.status.should.be.equal(200);
        Object.keys(res.body.entities.projects).length.should.be.equal(3);
        Object.keys(res.body.entities.users).length.should.be.equal(2);
        res.body.entities.projects['1'].title.should.be.equal('Project 1');
        res.body.entities.projects['1'].creator.should.be.equal(1);
        res.body.entities.projects['2'].title.should.be.equal('test test');
        res.body.entities.projects['2'].creator.should.be.equal(8);
        res.body.entities.projects['3'].title.should.be.equal('empty project');
        res.body.entities.projects['3'].creator.should.be.equal(8);
        res.body.entities.users['1'].name.should.be.equal('admin');
        res.body.entities.users['8'].name.should.be.equal('Роман Баландин');
      });
  });

  it ('should return project with id=1', function () {
    return agent
      .get('/data/load/project/1')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.entities.projects['1'].title.should.be.ok();
        res.body.entities.projects['1'].title.should.be.equal('Project 1');
        Object.keys(res.body.entities.sprints).length.should.be.equal(10);
        res.body.entities.sprints['1'].title.should.be.equal('1-1');
        Object.keys(res.body.entities.users).length.should.be.equal(1);
        res.body.entities.users['1'].name.should.be.equal('admin');
      });
  });

  it ('should return sprints', function () {
    return agent
      .get('/data/load/sprints/')
      .then((res) => {
        res.status.should.be.equal(200);
        Object.keys(res.body.entities.sprints).length.should.be.equal(10);
        res.body.entities.sprints['1'].title.should.be.equal('1-1');
        res.body.entities.sprints['9'].title.should.be.equal('1-9');
        Object.keys(res.body.entities.users).length.should.be.equal(1);
        res.body.entities.users['1'].name.should.be.equal('admin');
      });
  });

  it ('should return sprint with id=5', function () {
    return agent
      .get('/data/load/sprint/5')
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.entities.sprints['5'].title.should.be.equal('1-5');
        res.body.entities.sprints['5'].description.should.be.equal('короткий спринт (8 марта)');
        Object.keys(res.body.entities.tickets).length.should.be.equal(12);
        Object.keys(res.body.entities.users).length.should.be.equal(8);
        res.body.entities.tickets['7'].title.should.be.equal('Серая область в методе выделения в гриде Standard');
        res.body.entities.users['1'].name.should.be.equal('admin');
      });
  });

  it ('should return tickets', function () {
    return agent
      .get('/data/load/tickets/')
      .then((res) => {
        res.status.should.be.equal(200);
        Object.keys(res.body.entities.tickets).length.should.be.equal(12);
        Object.keys(res.body.entities.users).length.should.be.equal(7);
        res.body.entities.tickets['1'].title.should.be.equal('Разработка инструкции по разработке модуля на примере домашней бухгалтерии');
        res.body.entities.tickets['11'].title.should.be.equal('Сброс сортировки в гриде реестров');
        res.body.entities.users['2'].name.should.be.equal('Айрат Галямов');
        res.body.entities.users['9'].email.should.be.equal('murtasin@server.com');
      });
  });

  it('should return ticket with id=2', function () {
    return agent
      .get('/data/load/ticket/2')
      .then((res) => {
        res.status.should.be.equal(200);
        Object.keys(res.body.entities.tickets).length.should.be.equal(1);
        Object.keys(res.body.entities.users).length.should.be.equal(1);
        res.body.entities.tickets['2'].title.should.be.equal('Перенос инструкций на внешнюю вики');
        res.body.entities.users['2'].name.should.be.equal('Айрат Галямов');
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

  it('should fail to create new user with existing id', function () {
    return agent
      .post('/data/save/user')
      .set('Content-Type', 'application/json')
      .send({
        id: 1,
        name: 'admin2',
        email: 'admin2@server.com',
        role: 'manager'
      })
      .then((res) => {
        res.status.should.be.equal(500);

        return models.User.findById(1).then((user) => {
          user.name.should.be.equal('admin');
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

  it('should fail to create new project with existing id', function () {
    return agent
      .post('/data/save/project')
      .set('Content-Type', 'application/json')
      .send({
        id: 1,
        title: 'another project'
      })
      .then((res) => {
        res.status.should.be.equal(500);

        return models.Project.findById(1).then((project) => {
          project.title.should.be.equal('Project 1');
        });
      });
  });

  it('should create new sprint', function () {
    return agent
      .post('/data/save/sprint')
      .set('Content-Type', 'application/json')
      .send({
        root: {
          title: '1-x',
          creator_id: 1,
          project_id: 1
        },
        tickets: {
          added: [
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
        }
      })
      .then((res) => {
        res.status.should.be.equal(200);

        return models.Sprint.find({
          where: {
            id: res.body.root
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

  it('should fail to create new sprint without project_id', function () {
    return agent
      .post('/data/save/sprint')
      .set('Content-Type', 'application/json')
      .send({
        title: '1-y',
        creator_id: 1
      })
      .then((res) => {
        res.status.should.be.equal(500);

        return models.Sprint.count({
          where: {
            title: '1-y'
          }
        }).then((count) => {
          count.should.be.equal(0);
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

  it('should fail to create new ticket with existing id', function () {
    return agent
      .post('/data/save/ticket')
      .set('Content-Type', 'application/json')
      .send({
        id: 1,
        title: 'tick'
      })
      .then((res) => {
        res.status.should.be.equal(500);

        return models.Ticket.count({
          where: {
            title: 'tick'
          }
        }).then((count) => {
          count.should.be.equal(0);
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

        return models.Ticket.count({
          where: {
            id: [1, 3]
          }
        }).then((x) => {
          x.should.be.equal(0);
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

  it('should fail to update sprint with id=5 and ticket with existing id', function () {
    return agent
      .post('/data/save/sprint/5')
      .set('Content-Type', 'application/json')
      .send({
        root: {
          factor: 100
        },
        tickets: {
          added: [
            {
              id: 2,
              title: 'added ticket 55'
            }
          ]
        }
      })
      .then((res) => {
        res.status.should.be.equal(500);

        return Promise.all([
          models.Ticket.find({
            attributes: ['title'],
            where: {
              id: 2
            }
          }).then((ticket) => {
            ticket.title.should.be.equal('Перенос инструкций на внешнюю вики');
          }),
          models.Sprint.find({
            attributes: ['factor'],
            where: {
              id: 5
            }
          }).then((sprint) => {
            sprint.factor.should.be.equal(65);
          })
        ]);
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
          staffed: true
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
          models.Sprint.find({
            attributes: ['staffed'],
            where: {
              id: 5
            }
          }).then((sprint) => {
            sprint.staffed.should.be.ok();
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
          }),
          models.Ticket.count({
            where: {
              id: [7, 10]
            }
          }).then((x) => {
            x.should.be.equal(0);
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
  it('should delete project with id=2', function () {
    return agent
      .post('/data/delete/project/2')
      .set('Content-Type', 'application/json')
      .send()
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.should.be.equal(1);

        return models.Project.count({
          where: {
            id: 2
          }
        }).then((count) => {
          count.should.be.equal(0);
        });
      });
  });

  it('should delete sprint with id=9', function () {
    return agent
      .post('/data/delete/sprint/9')
      .set('Content-Type', 'application/json')
      .send()
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.should.be.equal(1);

        return models.Sprint.count({
          where: {
            id: 9
          }
        }).then((count) => {
          count.should.be.equal(0);
        });
      });
  });

  it('should delete ticket with id=2', function () {
    return agent
      .post('/data/delete/ticket/2')
      .set('Content-Type', 'application/json')
      .send()
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.should.be.equal(1);

        return models.Ticket.count({
          where: {
            id: 2
          }
        }).then((count) => {
          count.should.be.equal(0);
        });
      });
  });

  it('should delete user with id=6', function () {
    return agent
      .post('/data/delete/user/6')
      .set('Content-Type', 'application/json')
      .send()
      .then((res) => {
        res.status.should.be.equal(200);
        res.body.should.be.equal(1);

        return models.User.count({
          where: {
            id: 6
          }
        }).then((count) => {
          count.should.be.equal(0);
        });
      });
  });
});
