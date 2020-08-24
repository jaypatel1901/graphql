const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP
const { buildSchema } = require('graphql');
const mysql = require('mysql');
const cors = require('cors')
const {schema,queryDB} = require('./category')
const {Product_schema,Product_queryDB} = require('./product')
const { mergeSchemas } = require('graphql-tools')
const app = express();
app.use(cors())

const root = {
  getCategory: (args, req) => queryDB(req, "select * from category").then(data => data),
  getCategoryInfo: (args, req) => queryDB(req, "select * from category where id = ?", [args.id]).then(data => data[0]),
  updateCategoryInfo: (args, req) => queryDB(req, "update category SET ? where id = ?", [args, args.id]).then(data => data),
  createCategory: (args, req) => queryDB(req, "insert into category SET ?", args).then(data => data),
  deleteCategory: (args, req) => queryDB(req, "delete from category where id = ?", [args.id]).then(data => data),
  // products 
  getProduct: (args, req) => Product_queryDB(req, "select *,(select category_name from category where id = products.category_id ) AS category_name from products").then(data => data),
  // getProduct: (args, req) => Product_queryDB(req, "select products.id,products.product_name,products.quantity,products.sku,products.price,products.description,category.category_name from products join category on category.id=products.category_id").then(data => data),
  getProductInfo: (args, req) => queryDB(req, "select * from products where id = ?", [args.id]).then(data => data[0]),
  updateProductInfo: (args, req) => queryDB(req, "update products SET ? where id = ?", [args, args.id]).then(data => data),
  createProduct: (args, req) => queryDB(req, "insert into products SET ?", args).then(data => data),
  deleteProduct: (args, req) => queryDB(req, "delete from products where id = ?", [args.id]).then(data => data)
};

app.use((req, res, next) => {
  req.mysqlDb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'chat',
  });
  req.mysqlDb.connect();
  next();
});
const new_schema = mergeSchemas({
  schemas: [schema, Product_schema],
});

app.use('/graphql', graphqlHTTP({
  schema: new_schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');