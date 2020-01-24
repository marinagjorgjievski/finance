'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EntriesSchema extends Schema {
  up () {
    this.create('entries', (table) => {
      table.increments()
      table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.date('date')
      table.integer('value')
      table.timestamps()
    })
  }

  down () {
    this.drop('entries')
  }
}

module.exports = EntriesSchema
