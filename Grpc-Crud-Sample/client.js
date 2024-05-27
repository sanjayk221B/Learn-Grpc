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

const client = new protoDescriptor.ItemService('localhost:50051', grpc.credentials.createInsecure());

const item = { id: '1', name: 'Sample Item' };

// Create Item
client.CreateItem(item, (error, response) => {
  if (!error) {
    console.log('CreateItem:', response.message);
    getItem(item.id); // Fetch the item after creation
  } else {
    console.error('Error:', error);
  }
});

// Get Item
function getItem(id) {
  client.GetItem({ id }, (error, response) => {
    if (!error) {
      console.log('GetItem:', response.item);
      updateItem(id); // Update the item after fetching
    } else {
      console.error('Error:', error);
    }
  });
}

// Update Item
function updateItem(id) {
  const updatedItem = { id, name: 'Updated Item' };
  client.UpdateItem(updatedItem, (error, response) => {
    if (!error) {
      console.log('UpdateItem:', response.message);
      deleteItem(id); // Delete the item after updating
    } else {
      console.error('Error:', error);
    }
  });
}

// Delete Item
function deleteItem(id) {
  client.DeleteItem({ id }, (error, response) => {
    if (!error) {
      console.log('DeleteItem:', response.message);
    } else {
      console.error('Error:', error);
    }
  });
}