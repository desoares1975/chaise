'use strict';

const protocols = { 
  http: require('http'),
  https: require('https')
};

const chaise = {
  parseData(data) {
    try {
      return new Buffer(JSON.stringify(data));
    } catch(e) {
      return new Buffer('{}');
    }
  },
  Connection(config) {
    if (config.cookies) {
      config.path = '_session';
      chaise.connect(config, data => {
        config.Cookie = data;
        return config;
      });

      return config;
    }
  },
  connect(opts, body, cb) {
    let json = chaise.parseData(body),
        headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

    if (opts.cookie) {
      headers.Cookie = opts.cookie;
    }

    if (opts.basicAuth) {
      headers.Authorization = `Basic ${new Buffer(`${opts.user}:${opts.password}`).toString('base64')}`;
    }

    protocols[opts.protocol]
    .request({
      'method': opts.method,
      'protocol': opts.protocol,
      'host': opts.host,
      'port': opts.port,
      'path': opts.path,
      headers
    }, res => {
      let data = '';

      res.on('error', e => cb(e))
      .on('data', chunck => data += chunck)
      .on('end', () => cb(null, data));
    })
    .on('error', e => cb(e))
    .write(json)
    .end();
  },
  Schema(model) {
    this.model = model;
  }
};

chaise.Schema.prototype.validate = (model, cb) => {};
chaise.Schema.prototype.find = (query, cb) => {
};

module.exports = chaise;