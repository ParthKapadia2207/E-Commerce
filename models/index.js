// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category DONE
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Categories have many Products DONE
Category.hasMany(Product, {
  foreignKey: 'category_id'
});

// Products belongToMany Tags (through ProductTag) DONE
Product.belongsToMany(Tag, {
  through: 'product_tag',
  foreignKey: 'product_id'
});
// Tags belongToMany Products (through ProductTag) DONE
Tag.belongsToMany(Product, {
  through: 'product_tag',
  foreignKey: 'tag_id'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
