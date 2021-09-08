'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Author',
      [
        {
          id: 1,
          firstName: 'Александр',
          lastName: 'Пушкин',
          middleName: 'Сергеевич',
          birthDate: new Date('June 06, 1799 00:00:00'),
        },
        {
          id: 2,
          firstName: 'Лев',
          lastName: 'Толстой',
          middleName: 'Николаевич',
          birthDate: new Date('September 09, 1828 00:00:00'),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Author', null, {});
  },
};
