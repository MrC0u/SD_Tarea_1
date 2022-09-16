const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./src/controllers/searchengine.proto";
var protoLoader = require("@grpc/proto-loader");

var redis = require('redis')

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const redis_client = redis.createClient({
    url:"redis://redis:6379"
});

redis_client.on('ready',()=>{
    console.log("Redis is Ready (fun)")
})

redis_client.connect()
console.log('Redis conection: '+redis_client.isOpen);

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

    const search = req.query.s;
    (async () => {

        let reply = await redis_client.get(search);
            if(reply){
                cache = JSON.parse(reply);
                console.log("Search: "+search)
                console.log("Found on Cache:")
                var string_result=""
                for (i in cache['dataset']){
                var id=cache['dataset'][i].id
                var title=cache['dataset'][i].title
                var description=cache['dataset'][i].description
                var url=cache['dataset'][i].url
                const string_line='ID: '+id+' | Title:'+title+' | Description:'+description+' | URL:'+url
                string_result=string_result+string_line+'\n'
                }
                console.log(string_result)
                console.log("-------------------------- o --------------------------")


                res.status(200).json(cache)
            }else{

                client.GetServerResponse({message:search}, (error,answer) =>{
                    if(error){
                        
                        res.status(400).json(error);
                    }
                    else{
                        data = JSON.stringify(answer)
                        if (data['product']!==null){
                            redis_client.set(search,data)
                            res.status(200).json(answer);
                        }

                    }
                });
            }
    })();
};

module.exports = {
    getall,
    search
}