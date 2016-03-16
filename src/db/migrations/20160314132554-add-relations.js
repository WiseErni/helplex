'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Projects',
        'creator_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Sprints',
        'creator_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Sprints',
        'project_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'project_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'sprint_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'creator_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'developer_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'reviewer_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'tester_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Contracts',
        'sprint_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Contracts',
        'user_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ]).then(() => {
      return queryInterface.sequelize
        .query(
  `ALTER TABLE Projects ADD CONSTRAINT FK__Projects__Users__creator_id FOREIGN KEY(creator_id)
  REFERENCES Users (id)
  ON DELETE SET NULL

  ALTER TABLE Sprints ADD CONSTRAINT FK__Sprints__Users__creator_id FOREIGN KEY(creator_id)
  REFERENCES Users (id)
  ON DELETE SET NULL

  ALTER TABLE Sprints ADD CONSTRAINT FK__Sprints__Projects__project_id FOREIGN KEY(project_id)
  REFERENCES Projects (id)
  ON DELETE CASCADE

  ALTER TABLE Tickets ADD CONSTRAINT FK__Tickets__Projects__project_id FOREIGN KEY(project_id)
  REFERENCES Projects (id)
  ON DELETE CASCADE

  ALTER TABLE Tickets ADD CONSTRAINT FK__Tickets__Users__creator_id FOREIGN KEY(creator_id)
  REFERENCES Users (id)
  ON DELETE SET NULL

  ALTER TABLE Tickets ADD CONSTRAINT FK__Tickets__Users__developer_id FOREIGN KEY(developer_id)
  REFERENCES Users (id)

  ALTER TABLE Tickets ADD CONSTRAINT FK__Tickets__Users__reviewer_id FOREIGN KEY(reviewer_id)
  REFERENCES Users (id)

  ALTER TABLE Tickets ADD CONSTRAINT FK__Tickets__Users__tester_id FOREIGN KEY(tester_id)
  REFERENCES Users (id)

  ALTER TABLE Contracts ADD CONSTRAINT FK__Contracts__Sprints__sprint_id FOREIGN KEY(sprint_id)
  REFERENCES Sprints (id)
  ON DELETE CASCADE

  ALTER TABLE Contracts ADD CONSTRAINT FK__Contracts__Users__user_id FOREIGN KEY(user_id)
  REFERENCES Users (id)
  ON DELETE SET NULL`
      );
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize
      .query(
`ALTER TABLE Projects DROP CONSTRAINT FK__Projects__Users__creator_id

ALTER TABLE Sprints DROP CONSTRAINT FK__Sprints__Users__creator_id

ALTER TABLE Sprints DROP CONSTRAINT FK__Sprints__Projects__project_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Projects__project_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Sprints__sprint_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Users__creator_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Users__developer_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Users__reviewer_id

ALTER TABLE Tickets DROP CONSTRAINT FK__Tickets__Users__tester_id

ALTER TABLE Contracts DROP CONSTRAINT FK__Contracts__Sprints__sprint_id

ALTER TABLE Contracts DROP CONSTRAINT FK__Contracts__Users__user_id
`);
  }
};
