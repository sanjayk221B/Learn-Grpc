const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('protos/services.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).sample;

const items = {};

const server = new grpc.Server();

server.addService(protoDescriptor.ItemService.service, {
  CreateItem: (call, callback) => {
    const item = call.request;
    if (items[item.id]) {
      return callback(null, { message: 'Item already exists', item: null });
    }
    items[item.id] = item;
    callback(null, { message: 'Item created', item });
  },
  GetItem: (call, callback) => {
    const item = items[call.request.id];
    if (!item) {
      return callback(null, { message: 'Item not found', item: null });
    }
    callback(null, { message: 'Item retrieved', item });
  },
  UpdateItem: (call, callback) => {
    const item = call.request;
    if (!items[item.id]) {
      return callback(null, { message: 'Item not found', item: null });
    }
    items[item.id] = item;
    callback(null, { message: 'Item updated', item });
  },
  DeleteItem: (call, callback) => {
    const id = call.request.id;
    if (!items[id]) {
      return callback(null, { message: 'Item not found', item: null });
    }
    delete items[id];
    callback(null, { message: 'Item deleted', item: null });
  },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://0.0.0.0:50051');
  // server.start();
});