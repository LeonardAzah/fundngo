const asyncHandler = require("./asyncHandler");

const paginate = asyncHandler(
  async ({
    model,
    page = 1,
    limit = 10,
    selectFields = "",
    excludeFields = "",
    filters = {},
    populateOptions = [],
  }) => {
    const skip = (page - 1) * limit;

    const totalItems = await model.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    let query = model.find(filters);

    if (selectFields) {
      query = query.select(selectFields);
    }

    // Exclude fields if specified
    if (excludeFields) {
      const fieldsToExclude = excludeFields.split(" ");
      fieldsToExclude.forEach((field) => {
        query = query.select(`-${field}`);
      });
    }

    if (populateOptions && populateOptions.length > 0) {
      for (const { model: refModel, path, select } of populateOptions) {
        // Modify the populate object to include select fields if specified
        const populateObject = { path, model: refModel };
        if (select) {
          populateObject.select = select;
        }
        query = query.populate(populateObject);
      }
    }

    const data = await query.limit(limit).skip(skip).exec();

    const paginationResult = {
      data,
      currentPage: page,
      totalPages,
    };

    // Add previous and next page links
    if (page < totalPages) {
      paginationResult.nextPage = page + 1;
    }
    if (page > 1) {
      paginationResult.prevPage = page - 1;
    }

    return paginationResult;
  }
);

module.exports = paginate;
