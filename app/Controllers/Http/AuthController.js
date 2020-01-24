'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const { validate } = use('Validator')
const Hash = use('Hash')

/**
 * Resourceful controller for interacting with accounts
 */
class AuthController {

  async signIn ({ request, response, view }) {
    return view.render('auth.sign-in')
  }

  async login ({ request, response, auth, session }) {
    const email = request.input('email')
    const password = request.input('password')
    const remember = request.input('remember')

    const attemptUser = await User.findBy('email', email)

    if (!attemptUser) {
      session.withErrors({email: 'Invalid email or password'})
      return response.route('auth.sign-in')
    }

    const isSame = await Hash.verify(password, attemptUser.password);

    if (!isSame) {
      session.withErrors({email: 'Invalid email or password'})
      return response.route('auth.sign-in')
    }

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

  async register ({ request, response, view, session }) {

    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required|confirmed'
    }
    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    const user = new User()
    user.username = request.input('username')
    user.email = request.input('email')
    user.password = request.input('password')

    await user.save()

    return response.route('auth.sign-in')
  }

  async logout({ auth, response }) {
    await auth.logout()

    return response.route('home')
  }
}

module.exports = AuthController
