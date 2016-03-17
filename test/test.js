/*eslint-env mocha */
'use strict';
process.env.NODE_ENV = 'test';

// eslint-disable-next-line
const should =require('should');
const supertest = require('supertest');
const server = require('../src/server.js');
const models = require('../src/db/models');

const PORT = 3456;

const agent = supertest.agent('http://localhost:' + PORT);
server.listen(PORT);

describe('loading', function () {
  it('should return 200', function (done) {
    return agent
      .get('/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.text.should.be.equal('running...\n');
        done();
      });
  });

  it ('should return users', function (done) {
    return agent
      .get('/data/load/users/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(9);
        res.body[0].name.should.be.equal('admin');
        res.body[4].name.should.be.equal('Илья Першин');
        done();
      });
  });

  it ('should return user with id=3', function (done) {
    return agent
      .get('/data/load/user/3')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.role.should.be.equal('manager');
        res.body.email.should.be.equal('julia@server.com');
        done();
      });
  });

  it ('should return projects', function (done) {
    return agent
      .get('/data/load/projects')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(3);
        res.body[0].title.should.be.equal('Project 1');
        res.body[1].title.should.be.equal('test test');
        res.body[2].title.should.be.equal('empty project');
        res.body[0].creator.name.should.be.equal('admin');
        done();
      });
  });

  it ('should return project with id=1', function (done) {
    return agent
      .get('/data/load/project/1')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.title.should.be.ok();
        res.body.title.should.be.equal('Project 1');
        res.body.sprints.length.should.be.equal(10);
        res.body.sprints[0].title.should.be.equal('1-1');
        res.body.creator.name.should.be.equal('admin');
        done();
      });
  });

  it ('should return sprints', function (done) {
    return agent
      .get('/data/load/sprints/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(10);
        res.body[0].title.should.be.equal('1-1');
        res.body[8].title.should.be.equal('1-9');
        res.body[0].creator.name.should.be.equal('admin');
        done();
      });
  });

  it ('should return sprint with id=5', function (done) {
    return agent
      .get('/data/load/sprint/5')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.title.should.be.equal('1-5');
        res.body.description.should.be.equal('короткий спринт (8 марта)');
        res.body.tickets.length.should.be.equal(12);
        res.body.tickets[6].title.should.be.equal('Серая область в методе выделения в гриде Standard');
        res.body.creator.name.should.be.equal('admin');
        done();
      });
  });

  it ('should return tickets', function (done) {
    return agent
      .get('/data/load/tickets/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.length.should.be.equal(12);
        res.body[0].title.should.be.equal('Разработка инструкции по разработке модуля на примере домашней бухгалтерии');
        res.body[0].creator.name.should.be.equal('Айрат Галямов');
        res.body[10].title.should.be.equal('Сброс сортировки в гриде реестров');
        res.body[10].creator.email.should.be.equal('murtasin@server.com');
        done();
      });
  });

  it('should return ticket with id=2', function (done) {
    return agent
      .get('/data/load/ticket/2')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.title.should.be.equal('Перенос инструкций на внешнюю вики');
        res.body.creator.name.should.be.equal('Айрат Галямов');
        res.body.developer.name.should.be.equal('Айрат Галямов');
        done();
      });
  });
});

describe('saving', function () {
  it('should create new user', function (done) {
    return agent
      .post('/data/save/user')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Rick Sanches',
        email: 'rick@sick.com',
        role: 'developer'
      })
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        models.User.findById(res.body.id).then((user) => {
          user.name.should.be.equal('Rick Sanches');
          done();
        });
      });
  });

  it('should create new project', function (done) {
    return agent
      .post('/data/save/project')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Sample project',
        creator_id: 1
      })
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        models.Project.findById(res.body.id).then((project) => {
          project.title.should.be.equal('Sample project');
          done();
        });
      });
  });

  it('should create new sprint', function (done) {
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
      .end(function (err, res) {
        res.status.should.be.equal(200);
        res.body.id.should.be.ok();

        models.Sprint.find({
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
          done();
        });
      });
  });

  it('should create new ticket', function (done) {
    return agent
      .post('/data/save/ticket')
      .set('Content-Type', 'application/json')
      .send({
        title: 'create new ticket',
        creator_id: 1,
        project_id: 2
      })
      .end(function (err, res) {
        res.status.should.be.equal(200);

        models.Ticket.find({
          where: {
            id: res.body.id
          }
        }).then((ticket) => {
          ticket.title.should.be.equal('create new ticket');
          done();
        });
      });
  });

  it('should update user with id=1', function (done) {
    return agent
      .post('/data/save/user/1')
      .set('Content-Type', 'application/json')
      .send({
        name: 'admin 123',
        email: 'e@mail'
      })
      .end(function (err, res) {
        res.status.should.be.equal(200);

        models.User.findById(1).then((user) => {
          user.name.should.be.equal('admin 123');
          user.email.should.be.equal('e@mail');
          done();
        });
      });
  });

});

describe('deleting', function () {

});
