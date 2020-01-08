'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

// Bring a model
const Currency = use('App/Models/Currency')

// Bring in validator
const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with currencies
 */

class CurrencyController {


  async index ({ request, response, view }) {
    const currencies = await Currency.all();

    return view.render('currencies.index', {
      name: 'List Currencies',
      currencies: currencies.toJSON()
    })
  }

  /**
   * Render a form to be used for creating a new currencies.
   * GET currencies/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view}) {
    return view.render('currencies.create')
  }

  async store ({ request, response, session }) {

    //Validate input
    const validation = await validate(request.all(),{
      name: 'required|min:1|max:255',
      symbol: 'required|min:1'
    })

    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const currency = new Currency();

    currency.name = request.input('name')
    currency.symbol = request.input('symbol')

    await currency.save()

    session.flash({ notification: 'Currency Added!'})
    return response.redirect('/currencies')
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
    const currency = await Currency.find(params.id)
    return view.render('currencies.edit',
      {
        currency: currency
      })
  }

  async update ({ params, request, response, session}) {

    const currency = await Currency.find(params.id)

    //Validate input
    const validation = await validate(request.all(),{
      name: 'required|min:1|max:255',
      symbol: 'required|min:1'
    })

    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    currency.name = request.input('name')
    currency.symbol = request.input('symbol')

    await currency.save()

    session.flash({ notification: 'Currency Updated!'})

    return response.redirect('/currencies')
  }

  async destroy ({ params, request, response, session}) {
    const currency = await Currency.find(params.id)

    await currency.delete()

    session.flash({notification: 'Currency Deleted!'})

    return response.redirect('/currencies')

  }
}

module.exports = CurrencyController
