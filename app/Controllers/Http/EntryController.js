'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


// Bring in model
const Entry = use('App/Models/Entry')
const Account = use('App/Models/Account')
const Currency = use('App/Models/Currency')
const User = use('App/Models/User')

// Bring in validator
const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with accounts
 */
class EntryController {

  async index ({ request, response, view, auth }) {

    const entries = await Entry
      .query()
      .with('account')
      .orderBy('date')
      .fetch();

    return view.render('entries.index', {
      name: 'Your Entries',
      entries: entries.toJSON()
    })
  }

  async create ({ request, response, view }) {
    let accounts = await Account.pair('id', 'name')

    return view.render('entries.create', {
      accounts: accounts
    })
  }

  async store ({ request, response, session, auth }) {
    const entry = new Entry();

    //Validate input
    const validation = await validate(request.all(),{
      account_id: 'required|min:1|max:255',
      date: 'required|min:1',
      value: 'required|min:1'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    entry.account_id = request.input('account_id')
    entry.date = request.input('date')
    entry.value = request.input('value')

    await entry.save()

    session.flash({ notification: 'Entry Added!'})

    return response.redirect('/entries')
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view, auth }) {

    const entry = await Entry
      .query()
      .with('account.user')
      .where('id', params.id)
      .firstOrFail();

    if (!entry.getRelated('account') || !entry.getRelated('account').getRelated('user')) {
      return response.route('entries.index')
    }

    if (entry.getRelated('account').getRelated('user').id != auth.user.id) {
      return response.route('entries.index')
    }

    let accounts = await Account.pair('id', 'name')

    return view.render('entries.edit', {
      entry: entry,
      accounts: accounts
    })
  }

  async update ({ params, request, response, session, auth}) {

    const entry = await Entry
      .query()
      .with('account.user')
      .where('id', params.id)
      .firstOrFail();

    if (!entry.getRelated('account') || !entry.getRelated('account').getRelated('user')) {
      return response.route('entries.index')
    }

    if (entry.getRelated('account').getRelated('user').id != auth.user.id) {
      return response.route('entries.index')
    }

    //Validate input
    const validation = await validate(request.all(),{
      account_id: 'required|min:1|max:255',
      date: 'required|min:1',
      value: 'required|min:1'
    })

    entry.account_id = request.input('account_id')
    entry.date = request.input('date')
    entry.value = request.input('value')

    await entry.save()

    session.flash({notification: 'Entry Updated!'})

    return response.redirect('/entries')
  }

  async destroy ({ params, request, response, session }) {
    const entry = await Entry.find(params.id)
    await entry.delete()
    session.flash({notification: 'Entry Deleted'})
    return response.redirect('/entries')
  }
}

module.exports = EntryController
