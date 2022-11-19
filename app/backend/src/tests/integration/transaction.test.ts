import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../../app';
import Users from '../../database/models/Users';
import Token from '../../services/utils/Token';
import Accounts from '../../database/models/Accounts';

import { request, expect } from 'chai';
import Transactions from '../../database/models/Transactions';

chai.use(chaiHttp);

describe('Transaction endpoint tests', () => {
  describe('create a transaction', () => {
    describe('Successfuly', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Accounts, 'findByPk').callsFake(() => ({
          id: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          balance: 100
        }))

        // @ts-ignore
        sinon.stub(Accounts, 'update').callsFake(() => ({
          id: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          balance: 120
        }))

        // @ts-ignore
        sinon.stub(Transactions, 'create').callsFake(() => ({
          id: '339005ad-9a35-4f14-ae9c-39373ffb4d3e',
          debitedAccountId: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          creditedAccountId: '8c76fd54-0ede-4dc5-868b-c3a1606c5a5a',
          value: 20,
          transactionDate: '2022-11-19',
          createdAt: '2022-11-19 18:36:42.566+00',
        }))

        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should create a transaction successfully', async () => {
        const response = await request(app).post('/transaction').set('authorization', 'fakeToken').send({
          originAccount: '72e7ee4a-38d5-4521-967d-f29472ee6b03',
          destinationAccount: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          value: 20
        });

        expect(response).to.have.status(201);
      })
    })
    describe('Failure', () => {
      before(async () => {
        // @ts-ignore
        sinon.stub(Accounts, 'findByPk').callsFake(() => ({
          id: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          balance: 10
        }))

        sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
      })

      after(() => sinon.restore());

      it('Should not authorize request without token', async () => {
        const response = await request(app).post('/transaction');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equals('Expired or invalid token');
      })

      it('Should not authorize request with credited value greater than balance', async () => {
        const response = await request(app).post('/transaction').set('authorization', 'fakeToken').send({
          originAccount: '72e7ee4a-38d5-4521-967d-f29472ee6b03',
          destinationAccount: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
          value: 450
        });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equals('Credited value can not be greater than your balance');
      })
    })
  })

  describe('Get transactions', () => {
    before(async () => {
      // @ts-ignore
      sinon.stub(Transactions, 'findAll').callsFake(() => ([{
        id: '339005ad-9a35-4f14-ae9c-39373ffb4d3e',
        debitedAccountId: '170fc571-e09b-451f-9a99-8d9c59c5feb4',
        creditedAccountId: '8c76fd54-0ede-4dc5-868b-c3a1606c5a5a',
        value: 20,
        transactionDate: '2022-11-19',
        createdAt: '2022-11-19 18:36:42.566+00',
      }]))

      // @ts-ignore
      sinon.stub(Users, 'findOne').callsFake(() => ({ id: '170fc571-e09b-451f-9a99-8d9c59c5feb4' }))

      sinon.stub(Token, 'validate').returns({ username: 'Pedro' })
    })

    after(() => sinon.restore());

    it('Should return an error when invalid token', async () => {
      const response = await request(app).get('/transaction');

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equals('Expired or invalid token');
    })
    it('Should return all transactions', async () => {
      const response = await request(app).get('/transaction').set('authorization', 'fakeToken');

      expect(response).to.have.status(200);
    })
    it('Should return cash-in transactions', async () => {
      const response = await request(app)
        .get('/transaction')
        .set('authorization', 'fakeToken')
        .query({ transactionType: 'cash-in' });

      expect(response).to.have.status(200);
    })
    it('Should return cash-out transactions', async () => {
      const response = await request(app)
        .get('/transaction')
        .set('authorization', 'fakeToken')
        .query({ transactionType: 'cash-out' });

      expect(response).to.have.status(200);
    })
    it('Should return transactions by date', async () => {
      const response = await request(app)
        .get('/transaction')
        .set('authorization', 'fakeToken')
        .query({ date: '2022-11-19' });

      expect(response).to.have.status(200);
    })
    it('Should return transactions by date and cash-in', async () => {
      const response = await request(app)
        .get('/transaction')
        .set('authorization', 'fakeToken')
        .query({ transactionType: 'cash-in', date: '2022-11-19' });

      expect(response).to.have.status(200);
    })
    it('Should return by date and ', async () => {
      const response = await request(app)
        .get('/transaction')
        .set('authorization', 'fakeToken')
        .query({ transactionType: 'cash-out', date: '2022-11-19' });

      expect(response).to.have.status(200);
    })
  })
})