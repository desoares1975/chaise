'use strict';

const protocols = { 
  http: require('http'),
  https: require('https')
};

function Schema(schema) {
  this.model = schema;
}

module.exports = {
  'Schema': Schema,
  connect(options) {
    Schema.prototype.connection = protocols[options.localProtocol].request;
    Schema.prototype.opt = {
      'protocol': options.requestProtocol,
      'host': options.host,
      'port': options.port,
      'headers': options.headers
    };
  },
  authenticate(user, password, basic = true) {
    if (basic) {
      return setImmediate(() => {
        Schema.prototype.opt.auth = `${user}:${password}`;
      });
    }

    let options = Schema.prototype.options;
    options.method = 'POST';
    options.path =  '/_session';
    options.json = {user, password};
    protocols[options.localProtocol].request(options, (err, res) => {
      if (err) {
        throw new Error('Could not get session.');
      }

      Schema.prototype.opt.Cookie = res.headers.cookie;
    });
  }
};