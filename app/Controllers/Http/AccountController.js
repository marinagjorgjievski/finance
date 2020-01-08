'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


// Bring in model
const Account = use('App/Models/Account')
const Currency = use('App/Models/Currency')
const User = use('App/Models/User')

// Bring in validator
const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {

  async index ({ request, response, view, auth }) {

    const accounts = await Account
      .query()
      .with('currency')
      .with('user')
      .where('user_id', auth.user.id)
      .fetch();

    return view.render('accounts.index', {
        name: 'Your Accounts',
        accounts: accounts.toJSON()
    })
  }

  async create ({ request, response, view }) {
    let currencies = await Currency.pair('id', 'name');
    return view.render('accounts.create', {
      currencies: currencies
    })
  }

  async store ({ request, response, session, auth }) {
    const account = new Account();

    //Validate input
    const validation = await validate(request.all(),{
      name: 'required|min:1|max:255',
      currency_id: 'required|min:1'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    account.name = request.input('name')
    account.currency_id = request.input('currency_id')
    account.user_id = auth.user.id

    await account.save()

    session.flash({ notification: 'Account Added!'})

    return response.redirect('/accounts')
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view, auth }) {

    const account = await Account
      .query()
      .with('currency')
      .with('user')
      .where('id', params.id)
      .firstOrFail();

    if (!account.getRelated('user')) {
      return response.route('accounts.index')
    }

    if (account.getRelated('user').id != auth.user.id) {
      return response.route('accounts.index')
    }

    let currencies = await Currency.pair('id', 'name');

    return view.render('accounts.edit', {
      account: account,
      currencies: currencies
    })
  }

  async update ({ params, request, response, session, auth}) {

    const account = await Account
      .query()
      .with('currency')
      .with('user')
      .where('id', params.id)
      .firstOrFail();

    if (!account.getRelated('user')) {
      return response.route('accounts.edit', { id: params.id })
    }

    if (account.getRelated('user').id != auth.user.id) {
      return response.route('accounts.edit', { id: params.id })
    }

    //Validate input
    const validation = await validate(request.all(),{
      name: 'required|min:1|max:255',
      currency_id: 'required|min:1'
    })

    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    account.name = request.input('name')
    account.currency_id = request.input('currency_id')
    account.user_id = auth.user.id

    await account.save()

    session.flash({notification: 'Account Updated!'})

    return response.redirect('/accounts')
  }

  async destroy ({ params, request, response, session }) {
    const account = await Account.find(params.id)
    await account.delete()
    session.flash({notification: 'Account Deleted'})
    return response.redirect('/accounts')
  }
}

module.exports = AccountController
