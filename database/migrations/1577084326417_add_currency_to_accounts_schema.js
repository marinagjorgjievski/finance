'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCurrencyToAccountsSchema extends Schema {
  up () {
    this.table('accounts', (table) => {
      table.integer('currency_id').unsigned().references('id').inTable('currencies').after('name')
    })
  }

  down () {
    this.table('accounts', (table) => {
      table.dropColumn('currency_id')
    })
  }
}

module.exports = AddCurrencyToAccountsSchema
