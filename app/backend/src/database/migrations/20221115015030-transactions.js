'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      debitedAccountId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'debited_account_id'
      },
      creditedAccountId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'credited_account_id'
      },
      value: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      transactionDate: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date().toISOString().split(',')[0],
        field: 'transaction_date'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
