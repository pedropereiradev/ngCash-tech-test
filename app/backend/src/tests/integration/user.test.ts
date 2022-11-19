import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../../app';
import BCrypt from '../../services/utils/Bcrypt';
import Users from '../../database/models/Users';

chai.use(chaiHttp);

import { request, expect } from 'chai';
import Token from '../../services/utils/Token';
import Accounts from '../../database/models/Accounts';
import db from '../../database/models';
describe('User Endpoint Tests', () => {

  describe('Login', () => {
    describe('With valid date', () => {
      before(async () => {
        sinon.stub(BCrypt, 'compare').returns(true);
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => ({ dataValues: { username: 'Pedro', password: '1234567A' } }))
      })

      after(() => sinon.restore());

      it('Should login successfully and return a token', async () => {
        const response = await request(app).post('/login').send({
          username: 'Pedro',
          password: '1234567A',
        })

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');
      })

      it('Should not authorize login for invalid request format', async () => {
        const response = await request(app).post('/login').send({
          username: '',
          password: '1234567A',
        })

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid username or password');
      })
    })
    describe('Without valid data', () => {
      before(async () => {
        sinon.stub(BCrypt, 'compare').returns(false);
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => ({ dataValues: { username: 'Pedro', password: '1234567A' } }))
      })

      after(() => sinon.restore());

      it('Should not authorize login for invalid password', async () => {
        const response = await request(app).post('/login').send({
          username: 'Pedro',
          password: 'Senha1234',
        })

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid username or password');
      })

      it('Should not authorize login for invalid username', async () => {
        const response = await request(app).post('/login').send({
          username: 'Teste',
          password: '1234567A',
        })

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid username or password');
      })
    })
  })

  describe('Get a user', () => {
    describe('With valid token', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => ({ username: 'Pedro', accountId: '170fc571-e09b-451f-9a99-8d9c59c5feb4' }))
        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should return an user info', async () => {
        const response = await request(app).get('/user').set('authorization', 'fakeToken');

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('username')
        expect(response.body).to.have.property('accountId')
      })

      it('Should not authorize request whithout authorization header', async () => {
        const response = await request(app).get('/user');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.be.equal('Expired or invalid token')
      })
    })

    describe('Without valid token', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => ({ username: 'Pedro', accountId: '170fc571-e09b-451f-9a99-8d9c59c5feb4' }))
        sinon.stub(Token, 'validate').returns(null)
      })

      after(() => sinon.restore());

      it('Should not authorize request with invalid token', async () => {
        const response = await request(app).get('/user').set('authorization', 'fakeToken');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.be.equal('Expired or invalid token')
      })
    })
  })

  describe('Get all users', () => {
    describe('With valid token', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findAll').callsFake(async () => ([{ username: 'Teste', accountId: '72e7ee4a-38d5-4521-967d-f29472ee6b03' }]))
        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should return all users', async () => {
        const response = await request(app).get('/user/all').set('authorization', 'fakeToken');

        expect(response).to.have.status(200);
        expect(response.body[0]).to.have.property('username')
        expect(response.body[0]).to.have.property('accountId')
      })

      it('Should not authorize request whithout authorization header', async () => {
        const response = await request(app).get('/user/all');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.be.equal('Expired or invalid token')
      })
    })

    describe('Without valid token', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findAll').callsFake(async () => ([{ username: 'Teste', accountId: '72e7ee4a-38d5-4521-967d-f29472ee6b03' }]))
        sinon.stub(Token, 'validate').returns(null)
      })

      after(() => sinon.restore());

      it('Should not authorize request with invalid token', async () => {
        const response = await request(app).get('/user/all').set('authorization', 'fakeToken');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.be.equal('Expired or invalid token')
      })
    })
  })

  describe('Create an user', () => {
    describe('With invalid data format', () => {
      it('Should not allow user creation with invalid username', async () => {
        const response = await request(app).post('/user').send({
          username: 'Tes',
          password: '12345678'
        })

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid username or password');
      })
      it('Should not allow user creation with invalid password', async () => {
        const response = await request(app).post('/user').send({
          username: 'Teste',
          password: '12345678'
        })

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid username or password');
      })
    })
    describe('With valid data format', () => {
      describe('Sucess', () => {
        before(async () => {
          // @ts-ignore
          sinon.stub(Users, 'create').callsFake(async () => ({}))
          // @ts-ignore
          sinon.stub(Users, 'findOne').callsFake(async () => null)
          // @ts-ignore
          sinon.stub(Accounts, 'create').callsFake(async () => ({ id: '170fc571-e09b-451f-9a99-8d9c59c5feb4', balance: 100 }))
        })

        after(() => sinon.restore());
        it('Should create an user succesfully and returns a token', async () => {
          const response = await request(app).post('/user').send({
            username: 'User',
            password: 'NGCash22'
          })

          expect(response).to.have.status(200);
          expect(response.body).to.have.property('token');
        })
      })
      describe('User already exists', () => {
        before(async () => {
          // @ts-ignore
          sinon.stub(Users, 'create').callsFake(async () => ({}))
          // @ts-ignore
          sinon.stub(Users, 'findOne').callsFake(async () => ({ id: 'b80858d9-a958-4471-a862-af2dcd5d857b' }))
          // @ts-ignore
          sinon.stub(Accounts, 'create').callsFake(async () => ({ id: '170fc571-e09b-451f-9a99-8d9c59c5feb4', balance: 100 }))
        })

        after(() => sinon.restore());

        it('Should not create an user and returns a conflict', async () => {
          const response = await request(app).post('/user').send({
            username: 'User',
            password: 'NGCash22'
          })

          expect(response).to.have.status(409);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.be.equal('Username already exists');
        })

      })
    })
  })
})