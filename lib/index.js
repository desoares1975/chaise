'use strict';

const Bluebird = require('bluebird');
const protocols = { 
  http: require('http'),
  https: require('https')
};

function Schema(schema) {
  this.schema = schema;
}

function Chaise() {
  this.Schema = Schema;
}

Chaise.prototype.connect = Bluebird.promisify(function (options, cb) {
  options = options || {};
  this.Schema = Schema;
  this.Schema.prototype.connection = protocols[(options.localProtocol || 'http')].request;
  this.Schema.prototype.options = {
    'protocol': options.requestProtocol || 'http',
    'host': options.host || '127.0.0.1',
    'port': options.port || 5984,
    'headers': options.headers || {}
  };

  cb();
});

Chaise.prototype.authenticate = function (user, password, basic = true) {
    if (basic) {
    return setImmediate(() => {
      this.Schema.prototype.options.auth = `${user}:${password}`;
    });
  }

  let options = this.Schema.prototype.options;
  options.method = 'POST';
  options.path =  '/_session';
  options.json = {user, password};
  protocols[options.localProtocol].request(options, (err, res) => {
    if (err) {
      throw new Error('Could not get session.');
    }

    Schema.prototype.options.Cookie = res.headers.cookie;
  });
};


module.exports = new Chaise();
