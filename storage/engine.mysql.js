var mysql = require('mysql') // https://github.com/felixge/node-mysql
var log = require('tinylogger')
var misc = require('../ed2k/misc')
var conf = require('../enode.config').storage.mysql

var sql = {

  connection: null,
  current: 0,
  connectionsCount: 0,

  defErr: function(err, sender) { // default error handler
    sender = sender ? (sender+': ') : '';
    if (!err) return;
    log.error(JSON.stringify(err));
    if (err.fatal) {
      log.panic(sender+'MySQL '+err);
      process.exit();
    }
    else log.error(sender+'MySQL '+err);
    return false;
  },

  esc: function(value) { return sql.connection.escape(value); },

  query: function(str, values, callback) {
    if (callback == undefined) { callback = sql.defErr; }
    var q = sql.connection.query(str, values, function(err, rows) {
      if (err && err.code == 'ER_LOCK_DEADLOCK') {
        log.warn('Deadlock detected. Query: '+str);
        setTimeout(function() {
            sql.query(str, values, callback);
        }, conf.deadlockDelay);
        return;
      }
      callback(err, rows);
    });
    if (conf.log) {
      log.sql((conf.fullLog ? q.sql : q.sql.substring(0,80)));
    }
  },

  setErrorListener: function(sqlConnection) {
    sqlConnection.on('error', function(err) {
      if (err.code == 'PROTOCOL_CONNECTION_LOST') {
        log.warn(JSON.stringify(err));
        log.warn('MySQL connection Lost. Re-connecting.');
        sqlConnection = mysql.createConnection(sqlConnection.config);
        sql.setErrorListener(sqlConnection);
        sqlConnection.connect();
      }
      else {
        sql.defErr(err, 'ErrorListener');
      }
    });
  },

}

exports.init = function(callback) {
    sql.connection = mysql.createPool({
      host: conf.host,
      user: conf.user,
      password: conf.pass,
      database: conf.database,
      supportBigNumbers: true,
      connectionLimit: conf.connections
    })
    log.ok('Connected to MySQL server');
    sql.query('UPDATE clients SET online = 0', function(err){
      if (err) { return sql.defErr(err); }
      sql.query('UPDATE sources SET online = 0', function(err){
        if (err) { return sql.defErr(err); }
        setInterval(() => {
          files.updateCount();
          clients.updateCount();
        }, 5000 * 60);
        callback();
      });
    })
    sql.setErrorListener(sql.connection);
};

clients = {

  count: 0,

  getCount(){
    return this.count
  },

  /**
   * @param {Object} clientInfo Client connection information
   * @param {Buffer} clientInfo.hash Hash value reported on connection
   * @param {Function(err, connected)} callback
   * @returns undefined
   **/
  isConnected: function(clientInfo, callback) {
    // sql.query('SELECT id FROM clients WHERE hash = ? AND online = 1 LIMIT 1', [clientInfo.hash], function(err, rows){
    //   if (err) {
    //     callback(err);
    //     return;
    //   }
    //   if (rows.length > 0) {
    //     callback(false, true);
    //     return;
    //   }
      callback(false, false);
    // });
  },

  updateCount: function() {
    sql.query('SELECT COUNT(*) AS c FROM clients WHERE online = 1', function(err, row){ //  WHERE complete = 1 ?
      clients.count = row[0]['c'];
      log.trace('Clients count: '+files.count);
    });
  },

  get: function(hash, callback) {
    sql.query('SELECT * FROM clients WHERE hash = ? LIMIT 1', [hash], function(err, users){
      if (err) { return sql.defErr(err) }
      if (users.length > 0) { callback(users[0]); }
      else { callback(false); }
    });
  },

  /**
   * @param {Object} clientInfo Client connection information
   * @param {Buffer} clientInfo.hash
   * @param {Integer} clientInfo.id
   * @param {Integer} clientInfo.ipv4
   * @param {Integer} clientInfo.port
   * @param {Function} callback(err, storageId)
   **/
  connect: function(clientInfo, callback) {
    var v = {
      hash: clientInfo.hash,
      id_ed2k: clientInfo.id,
      ipv4: clientInfo.ipv4,
      ipv6: clientInfo.ipv6,
      port: clientInfo.port,
      online: 1,
    };
    

    clients.get(v.hash, function(result) {
      if(result === false){
        sql.query('INSERT INTO clients SET ?', [v,v],
        function(err, rows){
            callback(false, rows.insertId);
        });
      } else {
        sql.query('UPDATE clients SET ? WHERE id = ?', [v, result.id],
        function(err, res){
          callback(false, result.id);
        });
      }
    })
  },

  /**
   * Sets online status of client and client's file to 0
   * @param {Object} clientInfo Client connection information
   * @param {Integer} clientInfo.storageId
   * @param {Boolean} clientInfo.logged
   **/
  disconnect: function(clientInfo) { // when a user disconnects, set his online status to 0
    if (clientInfo.logged) {
      clientInfo.logged = false;
      log.info('client.disconnect: '+(clientInfo.storageId));
      sql.query('UPDATE clients SET online = 0 WHERE id = ?', [clientInfo.storageId]);
      log.todo('client.disconnect: Update client\'s files values for sources and completed ??');
    }
  },

  getById: function(clientId, callback) {
    sql.query('SELECT * FROM clients WHERE id_ed2k = ? LIMIT 1', [clientId], function(err, client){
      if (err) { return sql.defErr(err) }
      callback(client);
    });
  },

};

var files = {

  count: 0,

  getCount(){
    return this.count
  },

  get: function(fileHash, fileSize, callback) {
    sql.query('SELECT * FROM files WHERE hash = ? AND size = ? LIMIT 1', [fileHash, fileSize], function(err, files){
      if (err) { return sql.defErr(err) }
      if (files.length > 0) { callback(files[0]); }
      else { callback(false); }
    });
  },

  getByHash: function(fileHash, callback) {
    sql.query('SELECT * FROM files WHERE hash = ? LIMIT 1', [fileHash], function(err, files){
      if (err) { return sql.defErr(err) }
      if (files.length > 0) { callback(files[0].id); }
      else { callback(false); }
    });
  },

  add(file, clientInfo) {
    this.get(file.hash, file.size, function(theFile){
      if(theFile === false){
        sql.query('INSERT INTO files SET time_offer=NOW(), ?', {hash: file.hash, size: file.size}, function(err, results){
          if (err) { return sql.defErr(err); }
          files.addSource({ ...file, id: results.insertId }, clientInfo);
        });
      } else {
        sql.query('UPDATE files SET time_offer=NOW() WHERE hash = ? and size = ?', [file.hash, file.size], function(err){
          if (err) { return sql.defErr(err); }
          files.addSource({ ...file, id: theFile.id }, clientInfo);
        });
      }
    })
  },

  addSource: function(file, clientInfo) {
    if (!file.type) { file.type = misc.getFileType(file.name); }
    var v = {
      file_hash: file.hash, user_hash: clientInfo.hash, online: 1,
      complete: file.complete, name: file.name, ext: misc.getExt(file.name),
    };
    if (file.codec) v.codec = file.codec;
    if (file.type) v.type = file.type;
    if (file.rating) v.rating = file.rating;
    if (file.title) v.title = file.title;
    if (file.artist) v.artist = file.artist;
    if (file.album) v.album = file.album;
    if (file.bitrate) v.bitrate = file.bitrate;
    if (file.length) v.length = file.length;
    this.getSource(file.hash, clientInfo.hash, function(result){
      function callback(err){
        if (err) { return sql.defErr(err, 'files.addSource (insert)'); }
      }
      if(result === false){
        sql.query('INSERT INTO sources SET ?, time_offer = NOW()', [v], callback)
      } else {
        sql.query('UPDATE sources SET ?, time_offer = NOW() WHERE id = ?', [v, result.id], callback)
      }
    })
  },

  getSource: function(fileHash, userHash, callback) {
    sql.query('SELECT * FROM sources WHERE file_hash = ? and user_hash = ? LIMIT 1', [fileHash, userHash], function(err, files){
      if (err) { return sql.defErr(err) }
      if (files.length > 0) { callback(files[0]); }
      else { callback(false); }
    });
  },

  getSources: function(fileHash, callback) {
    // TODO: 下线的客户端是否要返回？
    const q = 'SELECT c.id_ed2k AS id,c.ipv6 as ipv6, c.port '+
    'FROM sources AS s '+
    'INNER JOIN clients AS c ON c.hash = s.user_hash '+
    'WHERE s.file_hash = ? and c.online = 1 '+
    'ORDER BY s.online DESC, s.time_offer DESC '+
    'LIMIT 255'
    sql.query(q, [fileHash], function(err, files){
      if (err) { return sql.defErr(err) }
      callback(files)
    });
  },

  getSourcesByHash: function(fileHash, callback) {
    files.getByHash(fileHash, function(fileId){
      if (fileId != false) {
        var q = 'SELECT c.id_ed2k AS id, c.port '+
          'FROM sources AS s '+
          'INNER JOIN clients AS c ON c.id = s.id_client '+
          'WHERE s.id_file = ? '+
          'ORDER BY s.online DESC, s.time_offer DESC '+
          'LIMIT 255';
        sql.query(q, [fileId], function(err, sources){
          if (err) { return sql.defErr(err); }
          if (misc.isFunction(callback)) callback(fileHash, sources)
        });
      }
      else {
        if (misc.isFunction(callback)) callback(fileHash, [])
      }
    });
  },

  updateCount: function() {
    sql.query('SELECT COUNT(*) AS c FROM files', function(err, row){ //  WHERE complete = 1 ?
      files.count = row[0]['c'];
      log.trace('Files count: '+files.count);
    });
  },

  find: function(data, callback) {
    try {
      var where = data.getSearchString();
      var t = Math.floor(Math.random()*1000000);
      var t = new Date().getTime();
      var q = "SELECT s.name, f.hash,f.size, sum(complete) completed,count(*) sources, 0 source_id, 0 source_port, "+
        "s.type, s.title, s.artist, s.album, s.length AS runtime, s.bitrate, s.codec "+
        "FROM sources AS s "+
        "INNER JOIN files AS f ON s.file_hash = f.hash "+
        "WHERE "+where+" "+
        "GROUP BY s.file_hash "+
        "LIMIT 255";
      sql.query(q, function(err, sources){
        log.sql('Time: '+((new Date().getTime()-t) / 1000)+'s');
        if (err) throw(err);
        if (sources.count < 1) { callback([]); }
        callback(sources);
      });
    } catch (err) {
      sql.defErr(err, 'files.find');
      callback([]);
    }
  },

};

var servers = {

  count: 0,

  list: [
  ],

  getCount(){
    return this.count
  },

  all: function() {
    return servers.list;
  },

};

var likes = function(text) {
  var r = [];
  text.split(' ').forEach(function(v){
    if (v != ' ') {
      r.push("s.name LIKE "+sql.esc('%'+v+'%'));
    }
  });
  return r.join(' AND ');
}

var searchExpr = function(token, type, value) {
  switch (type) {
    case 0xff: return likes(value);
    case 0x00: return " AND ";
    case 0x01: return " OR ";
    case 0x02: return " AND NOT ";
    case 0x030001: return "s.type="+sql.esc(value);
    case 0x040001: return "s.ext="+sql.esc(value);
    case 0xd50001: return "s.codec="+sql.esc(value);
    case 0x02000101: return "f.size>"+sql.esc(value);
    case 0x02000102: return "f.size<"+sql.esc(value);
    case 0x15000101: return "f.sources>"+sql.esc(value);
    case 0xd4000101: return "s.bitrate>"+sql.esc(value);
    case 0xd3000101: return "s.duration>"+sql.esc(value);
    case 0x30000101: return "f.completed>"+sql.esc(value);
    default: log.warn('searchExpr: unknown type: 0x'+type.toString(16)+' - token: 0x'+token.toString(16)+'; value: '+value);
  }
}

Buffer.prototype.getSearchString = function() {
  var token = this.getUInt8();
  switch (token) {
    case 0x01: // text match
      return searchExpr(token, 0xff, this.getString());
    case TYPE_STRING: // string
      var value = this.getString();
      var type = this.getUInt8();
      type+= this.getUInt16LE() * 0x100;
      return searchExpr(token, type, value);
    case TYPE_UINT32: // 32bit value
      var value = this.getUInt32LE();
      var type = this.getUInt32LE();
      return searchExpr(token, type, value);
    case 0x08: // 64bit value
      var value = this.getUInt32LE();
      value+= this.getUInt32LE() * 0x10000 * 0x10000;
      var type = this.getUInt32LE();
      return searchExpr(token, type, value);
    case 0x00: // tree node
      var type = this.getUInt8();
      var s = '(' + this.getSearchString();
      s+= searchExpr(token, type, null);
      return s + this.getSearchString() + ')';
    default:
      log.warn('Buffer.getSearchString: unknown token: 0x'+token.toString(16));
  }
  return '';
}; // http://en.wikipedia.org/wiki/Binary_expression_tree

exports.clients = clients;
exports.files   = files;
exports.servers = servers;
