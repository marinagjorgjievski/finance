'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurrenciesSchema extends Schema {
  up () {
    this.create('currencies', (table) => {
      table.increments()
      table.string('name')
      table.string('symbol')
      table.timestamps()
    })
  }

  down () {
    this.drop('currencies')
  }
}

module.exports = CurrenciesSchema
