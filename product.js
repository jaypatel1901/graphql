const { buildSchema } = require('graphql');

const Product_schema = buildSchema(`
  type Product {
    id: String
    product_name: String
    quantity:Int
    sku:String
    category_id:Int,
    qr_code:String,
    description:String,
    price:Int
    category_name:String
  }
  type Query {
    getProduct: [Product],
    getProductInfo(id: Int) : Product
  }
  type Mutation {
    updateProductInfo(id: Int, product_name: String, quantity: Int, sku: String,category_id:Int,qr_code:String,description:String,price:Int) : Boolean
    createProduct(product_name: String, quantity: Int, sku: String,category_id:Int,description:String,price:Int) : Boolean
    deleteProduct(id: Int) : Boolean
  }
`);

const Product_queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err)
            return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

module.exports = {Product_queryDB,Product_schema}