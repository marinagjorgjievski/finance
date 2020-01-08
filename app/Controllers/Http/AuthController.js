'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Hash = use('Hash')

/**
 * Resourceful controller for interacting with accounts
 */
class AuthController {

  async signIn ({ request, response, view }) {
    return view.render('auth.sign-in')
  }

  async login ({ request, response, auth }) {
    const email = request.input('email')
    const password = request.input('password')
    const remember = request.input('remember')

    const attemptUser = await User.findByOrFail('email', email)

    // Attempt to login with email and password
    const authCheck = await auth.remember(remember).login(attemptUser)
    if (authCheck) {
      return response.route('home')
    }

    return response.route('home')
  }

  async showRegister ({ request, response, view }) {
    return view.render('auth.register')
  }

  async register ({ request, response, view }) {
    const user = new User()
    user.username = request.input('username')
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))

    await user.save()

    return response.route('auth.sign-in')
  }

  async logout({ auth, response }) {
    await auth.logout()

    return response.route('home')
  }
}

module.exports = AuthController
