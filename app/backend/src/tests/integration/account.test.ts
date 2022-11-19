import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../../app';
import Users from '../../database/models/Users';
import Token from '../../services/utils/Token';
import Accounts from '../../database/models/Accounts';

import { request, expect } from 'chai';

chai.use(chaiHttp);

describe('Account endpoint tests', () => {
  describe('Get balance', () => {
    describe('success', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => ({
          id: 'b80858d9-a958-4471-a862-af2dcd5d857b',
          username: 'Pedro',
          password: '$2a$10$kqQOr7BJOtwbm0HNkCI02eoJcbqJdfPlVkIpUy5F9RW8KUFobxh.u',
          accountId: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
        }))
        // @ts-ignore
        sinon.stub(Accounts, 'findByPk').callsFake(async () => ({
          id: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          balance: 100
        }))

        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should return user account info', async () => {
        const response = await request(app).get('/account/balance').set('authorization', 'fakeToken');

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('balance');
      })
    })

    describe('Failure', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Users, 'findOne').callsFake(async () => (null))
        // @ts-ignore
        sinon.stub(Accounts, 'findByPk').callsFake(async () => (null))

        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should not authorize request without token', async () => {
        const response = await request(app).get('/account/balance');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equals('Expired or invalid token');
      })

      it('Should return user not found error', async () => {
        const response = await request(app).get('/account/balance').set('authorization', 'fakeToken');

        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equals('User account not found');
      })
    })
  })
})