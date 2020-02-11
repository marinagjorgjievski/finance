'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EntriesSchema extends Schema {
  up () {
    this.table('entries', (table) => {
      table.decimal('value', 9, 2).alter();
      table.renameColumn('value', 'amount');
    })
  }

  down () {
    this.table('entries', (table) => {
      table.integer('amount').alter();
      table.renameColumn('amount', 'value');
    })
  }
}

module.exports = EntriesSchema
