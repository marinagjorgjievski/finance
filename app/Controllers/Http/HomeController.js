'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with accounts
 */
class HomeController {

  async home({ view }) {
    return view.render('welcome', { body_class: 'home' })
  }
}

module.exports = HomeController
