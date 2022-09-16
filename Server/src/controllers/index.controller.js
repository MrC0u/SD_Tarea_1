const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./src/controllers/searchengine.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const searchEngine = grpc.loadPackageDefinition(packageDefinition).searchEngine;

const client = new searchEngine(
    "grpc_server:50051",
    grpc.credentials.createInsecure()
  );

const getall = (req, res) => {
    res.send(" En Proceso ");
};

const search = (req, res) => {

    const search=req.query.q;
    (async () => {

        client.GetServerResponse({message:search}, (error,answer) =>{
            if(error){
                
                res.status(400).json(error);
            }
            else{
                data = JSON.stringify(answer)
                if (data['product']!==null){
                    res.status(200).json(answer);
                }

            }
        });
        
    })();
};

module.exports = {
    getall,
    search
}