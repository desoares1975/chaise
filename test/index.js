'use strict'; 

const request = require('request');
const { expect } = require('chai');
const chaise = require('../');

describe('Chaise testing', () => {
  it('Gets an instance of Chaise', done => {
    expect(chaise).to.have.own.property('Schema');
    expect(chaise).to.have.property('connect');
    expect(chaise).to.have.property('authenticate');
    done();
  });
  it('test connection', done => {
    chaise.connect({})
      .then(() => {
        expect(chaise.connection).to.be.a('function');
        done();
      })
      .catch(e => done(e));
  });
});
