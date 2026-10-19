
const categoryModel = require('../models/category.model');

function handleError(action, error, res, message) {
    console.error(`Error ${action}:`, error);

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_CATEGORY',
                message: 'That category name already exists.'
            }
        });
    }

    if (error.code === 'ER_NO_SUCH_TABLE' ||
        error.code === 'ER_BAD_FIELD_ERROR' ||
        error.code === 'ER_BAD_DB_ERROR') {
        return res.status(500).json({
            success: false,
            error: {
                code: 'DATABASE_CONFIGURATION_ERROR',
                message: 'A database table, column, or database name needs checking. Check the server terminal.'
            }
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message
        }
    });
}

async function getAll(req, res) {
    try {
        const categories = await categoryModel.getAll();

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return handleError(
            'fetching categories',
            error,
            res,
            'Failed to retrieve categories.'
        );
    }
}

async function getById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_ID',
                    message: 'A valid category ID is required.'
                }
            });
        }

        const category = await categoryModel.getById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Category not found.'
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        return handleError(
            'fetching category',
            error,
            res,
            'Failed to retrieve category.'
        );
    }
}

async function create(req, res) {
    try {
        const { category_name, description, status } = req.body;

        if (typeof category_name !== 'string' || !category_name.trim()) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Category name is required.'
                }
            });
        }

        if (category_name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Category name must not exceed 100 characters.'
                }
            });
        }

        if (description != null && typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Description must be text.'
                }
            });
        }

        if (status !== undefined &&
            !['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Status must be Active or Inactive.'
                }
            });
        }

        const category = await categoryModel.create({
            category_name: category_name.trim(),
            description: description?.trim() || null,
            status: status || 'Active'
        });

        return res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: category
        });
    } catch (error) {
        return handleError(
            'creating category',
            error,
            res,
            'Failed to create category.'
        );
    }
}

async function update(req, res) {
    try {
        const id = Number(req.params.id);
        const { category_name, description, status } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_ID',
                    message: 'A valid category ID is required.'
                }
            });
        }

        if (typeof category_name !== 'string' || !category_name.trim()) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Category name is required.'
                }
            });
        }

        if (category_name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Category name must not exceed 100 characters.'
                }
            });
        }

        if (description != null && typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Description must be text.'
                }
            });
        }

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Status must be Active or Inactive.'
                }
            });
        }

        const category = await categoryModel.update(id, {
            category_name: category_name.trim(),
            description: description?.trim() || null,
            status
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Category not found.'
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            data: category
        });
    } catch (error) {
        return handleError(
            'updating category',
            error,
            res,
            'Failed to update category.'
        );
    }
}

async function remove(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_ID',
                    message: 'A valid category ID is required.'
                }
            });
        }

        const deleted = await categoryModel.remove(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Category not found.'
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully.'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'CATEGORY_IN_USE',
                    message: 'This category is used by other records.'
                }
            });
        }

        return handleError(
            'deleting category',
            error,
            res,
            'Failed to delete category.'
        );
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
