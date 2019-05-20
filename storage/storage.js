var conf = require('../enode.config')
var engine = require('./engine.'+conf.storage.engine+'')

exports.init = engine.init
exports.clients = engine.clients
exports.files = engine.files
exports.servers = engine.servers
