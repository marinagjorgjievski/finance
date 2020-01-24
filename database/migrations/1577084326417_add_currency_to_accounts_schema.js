'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCurrencyToAccountsSchema extends Schema {
  up () {
    this.table('accounts', (table) => {
      table.integer('currency_id').unsigned().references('id').inTable('currencies').after('name').onDelete('SET NULL')
    })
  }

  down () {
    this.table('accounts', (table) => {
      table.dropForeign('currency_id');
      table.dropColumn('currency_id')
    })
  }
}

module.exports = AddCurrencyToAccountsSchema
