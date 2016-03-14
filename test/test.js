/*eslint-env mocha */
'use strict';

var assert = require('assert');

describe('sequelize', () => {
  describe('create', () => {
    /*it('creates a project', () => {
      let Project = require('../src/db/models').Project;

      return Project.create({
        title: 'ehehe'
      }).then((project) => {
        assert(project.id);
      });
    });*/

    it('creates a project with sprint', () => {
      let Project = require('../src/db/models').Project;
      let Sprint = require('../src/db/models').Sprint;

      return Sprint.destroy({ where: {} })
        .then(() => {
          Project.destroy({ where: {} });
        });
    });
  });
});
