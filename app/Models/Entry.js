'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Entry extends Model {

  static get dates() {
    return super.dates.concat(['date'])
  }

  static castDates (field, value) {
    if (field === 'date') {
      return value.format('DD/MM/YYYY');
    }
    return super.formatDates(field, value)
  }

  account () {
    return this.belongsTo('App/Models/Account')
  }

}

module.exports = Entry
