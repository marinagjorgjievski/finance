'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUserToAccountsSchema extends Schema {
  up () {
    this.table('accounts', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').after('id')
    })
  }

  down () {
    this.table('accounts', (table) => {
      table.dropForeign('user_id');
      table.dropColumn('user_id')
    })
  }
}

module.exports = AddUserToAccountsSchema
