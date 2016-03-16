/*eslint-env mocha */
'use strict';

//var assert = require('assert');

describe('sequelize', () => {
  describe('create', () => {
    /*it('creates a project', () => {
      let Project = require('../src/db/models').Project;
      let Ticket = require('../src/db/models').Ticket;

      return Project.create({
        title: 'ehehe',
        Tickets: [
          {
            title: 'ticket1'
          }
        ]
      }, {
        include: [
          {
            model: Ticket
          }
        ]
      }).then((project) => {
        assert(project);
      });
    });*/

    /*it('creates a project with 3 sprints', () => {
      let Project = require('../src/db/models').Project;
      let Sprint = require('../src/db/models').Sprint;

      let destroySprints = () => {
        return Sprint.destroy({
          where: {}
        });
      };

      let destroyProjects = () => {
        return Project.destroy({
          where: {}
        });
      };

      let createTestProject = () => {
        return Project.create({
          title: 'creates a project with 3 sprints',
          Sprints: [
            {
              title: '1-1'
            }, {
              title: '1-2'
            }, {
              title: '1-3'
            }
          ]
        }, {
          include: [
            {
              model: Sprint
            }
          ]
        }).then((project) => {
          assert(project.get('id'));
        });
      };

      return destroySprints()
        .then(destroyProjects)
        .then(createTestProject);
    });*/
  });
});
