'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Authors',
      [
        {
          id: 1,
          firstName: 'Александр',
          lastName: 'Пушкин',
          middleName: 'Сергеевич',
          birthDate: new Date('June 06, 1799 00:00:00'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Лев',
          lastName: 'Толстой',
          middleName: 'Николаевич',
          birthDate: new Date('September 09, 1828 00:00:00'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'Books',
      [
        {
          name: 'Капитанская дочка',
          authorId: 1,
          publicationYear: 1836,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Пиковая дама',
          authorId: 1,
          publicationYear: 1834,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Война и мир',
          authorId: 2,
          publicationYear: 1867,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Анна Каренина',
          authorId: 2,
          publicationYear: 1877,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Authors', null, {});
  },
};
