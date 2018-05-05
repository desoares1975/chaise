'use strict';

const protocols = { 
  http: require('http'),
  https: require('https')
};

const obj = {
  Connection(ops) {
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    let data = '', 
        request = protocols[ops.protocol].request({
      'method': 'POST',
      'protocol': ops.protocol,
      'host': ops.host,
      'port': ops.port,
      'path': (ops.cookie ? '_session' : '')
    }, response => {
      response.on('data', chunk => {
        data += chunk;
      });
      response.on('error', e => {
        return e;
      });
      response.on('end', () => {
        return data;
      });
    });

    request.on('error', e => {
      return e;
    });
  },
  connect(config, cb) {
    let connection = new obj.Connection(config);
    return connection;
  },
  Schema(doc) {
    this.doc = doc;
  }
};

module.exports = obj;