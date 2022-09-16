const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./searchEngine.proto"
var protoLoader = require("@grpc/proto-loader");
const { client } = require("./src/db-connect");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(proto.searchEngine.service, {
  GetServerResponse: (call, callback) => {
    const search = call.request.message;

    client.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query(`select * from dataset where keywords like '%' || $1 || '%';`, [search], (err, result) => {
        release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }

        console.log("Resultados:")
        var string_total = ""
        for (i in result.rows) {
          var { id, title, description, url} = result.rows[i];
          var id = result.rows[i].id;
          var title = result.rows[i].title;
          var description = result.rows[i].description;
          var url = result.rows[i].url;
          const stringsumar = 'id: ' + id + ' | Title:' + title + ' | description:' + description + ' | URL:' + url;
          string_total = string_total + stringsumar + '\n';
        }
        if (string_total == "") {
          string_total = "No hay resultados..."
          callback(null, null);
        }
        else {
          callback(null, { dataset: result.rows });
        }
        console.log(string_total)
        console.log("--------------------------------------------------------------------------------------------------------------------------------")


      })
    })
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server gRPC running at http://127.0.0.1:50051");
    server.start();
  }
);