const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Category {
    id: String
    category_name: String
  }
  type Query {
    getCategory: [Category],
    getCategoryInfo(id: Int) : Category
  }
  type Mutation {
    updateCategoryInfo(id: Int, category_name: String) : Boolean
    createCategory(category_name: String) : Boolean
    deleteCategory(id: Int) : Boolean
  }
`);

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err)
            return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

module.exports = {queryDB,schema}