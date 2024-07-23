const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      include: {
        // be sure to include its associated Product data
        model: Product,
        through: ProductTag,
      },
    });
    if (!tagData) {
      return res.status(404).json({ error: 'tag data could not be found' })
    }
    return res.json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  const tagId = req.params.id;
  try {
    const tagData = await Tag.findByPk(tagId, {
      // be sure to include its associated Product data
      include: {
        // be sure to include its associated Product data
        model: Product,
        through: ProductTag,
      },
    });
    if (!tagData) {
      return res.status(404).json({ error: 'tag data could not be found' })
    }
    return res.json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this Id' })
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json( {message: 'No Tag Found with that Id' });
      return;
    }
    res.status(200).json(tagData)
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;