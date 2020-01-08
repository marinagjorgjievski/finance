'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Currency extends Model {

  accounts () {
    return this.hasMany('App/Models/Account')
  }

}

module.exports = Currency
