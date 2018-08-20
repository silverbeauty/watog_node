
const { validationResult } = require('express-validator/check')

const Category = require('../models/category')

const create = async (req, res) => {
 	const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

  const category = Category.build({
    type: req.body.type,
    user_id: req.currentUser.id
  })

  let data
  try {
    const res = await category.save()
    data = res.get({plain: true})
    // Remove password
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      status: false,
      error: e.errors
    })
  }

  res.send({
    status: true,
    data
  })
}

const get = async (req, res) => {
  const category = await Category.findById(req.params.id)
  res.send({
    status: true,
    data: category.get({ plain: true})
  })
}

const query = async (req, res) => {
  // TODO: query condition should be defined in route
  // TODO: limit access to users
  const allowed_queries = ['limit', 'offset', 'user_id']
  const query = {...req.query}
  const cquery = {...query}

  // Check valid queries
  for (let key of allowed_queries) {
    delete cquery[key]
  }

  if (Object.keys(cquery).length > 0) { // Other queries
    console.error('Query not allowed:', cquery)
    return res.status(400).send({
      status: false,
      error: {
        msg: 'Query not allowed',
        data: cquery
      }
    })
  }

  const limit = query.limit || 10000
  const offset = query.offset || 0

  // Remove offset, limit
  delete query.limit
  delete query.offset

  const data = await Category.findAll({
    where: query,
    limit,
    offset,
    raw: true
  })

  res.send({
    status: true,
    data
  })
}

module.exports = {
  create,
  get,
  query
}