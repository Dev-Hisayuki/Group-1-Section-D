
const roleModel = require("../models/role.model");

const MAX_ROLE_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 255;

function sendError(res, status, code, message) {
    return res.status(status).json({
        success: false,
        error: {
            code,
            message
        }
    });
}

function handleError(action, error, res) {
    console.error(`Role ${action} error:`, error);

    if (error.code === "ER_DUP_ENTRY") {
        return sendError(
            res,
            409,
            "DUPLICATE_ROLE",
            "That role name already exists. Please choose another name."
        );
    }

    if (
        error.code === "ER_ROW_IS_REFERENCED_2" ||
        error.code === "ER_ROW_IS_REFERENCED_3"
    ) {
        return sendError(
            res,
            409,
            "ROLE_IN_USE",
            "This role is assigned to users and cannot be deleted."
        );
    }

    return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        `Failed to ${action} role. Please try again.`
    );
}

function validateRoleInput(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return {
            valid: false,
            message: "Invalid request body."
        };
    }

    const { role_name, description } = body;

    if (typeof role_name !== "string" || !role_name.trim()) {
        return {
            valid: false,
            message: "Role name is required."
        };
    }

    const normalizedName = role_name.trim();

    if (normalizedName.length > MAX_ROLE_NAME_LENGTH) {
        return {
            valid: false,
            message: "Role name must not exceed 50 characters."
        };
    }

    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        return {
            valid: false,
            message: "Description must be text."
        };
    }

    const normalizedDescription =
        typeof description === "string" ? description.trim() : "";

    if (normalizedDescription.length > MAX_DESCRIPTION_LENGTH) {
        return {
            valid: false,
            message: "Description must not exceed 255 characters."
        };
    }

    return {
        valid: true,
        data: {
            role_name: normalizedName,
            description: normalizedDescription || null
        }
    };
}

function validateRoleId(value) {
    const id = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isSafeInteger(id) ||
        id <= 0
    ) {
        return null;
    }

    return id;
}

async function getAll(req, res) {
    try {
        const roles = await roleModel.getAll();

        return res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        return handleError("retrieve", error, res);
    }
}

async function getById(req, res) {
    const id = validateRoleId(req.params.id);

    if (!id) {
        return sendError(
            res,
            400,
            "INVALID_ROLE_ID",
            "Please provide a valid role ID."
        );
    }

    try {
        const role = await roleModel.getById(id);

        if (!role) {
            return sendError(
                res,
                404,
                "ROLE_NOT_FOUND",
                "Role not found."
            );
        }

        return res.json({
            success: true,
            data: role
        });
    } catch (error) {
        return handleError("retrieve", error, res);
    }
}

async function create(req, res) {
    const validation = validateRoleInput(req.body);

    if (!validation.valid) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            validation.message
        );
    }

    try {
        const role = await roleModel.create(validation.data);

        return res.status(201).json({
            success: true,
            message: "Role created successfully.",
            data: role
        });
    } catch (error) {
        return handleError("create", error, res);
    }
}

async function update(req, res) {
    const id = validateRoleId(req.params.id);

    if (!id) {
        return sendError(
            res,
            400,
            "INVALID_ROLE_ID",
            "Please provide a valid role ID."
        );
    }

    const validation = validateRoleInput(req.body);

    if (!validation.valid) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            validation.message
        );
    }

    try {
        const role = await roleModel.update(id, validation.data);

        if (!role) {
            return sendError(
                res,
                404,
                "ROLE_NOT_FOUND",
                "Role not found."
            );
        }

        return res.json({
            success: true,
            message: "Role updated successfully.",
            data: role
        });
    } catch (error) {
        return handleError("update", error, res);
    }
}

async function remove(req, res) {
    const id = validateRoleId(req.params.id);

    if (!id) {
        return sendError(
            res,
            400,
            "INVALID_ROLE_ID",
            "Please provide a valid role ID."
        );
    }

    try {
        const role = await roleModel.getById(id);

        if (!role) {
            return sendError(
                res,
                404,
                "ROLE_NOT_FOUND",
                "Role not found."
            );
        }

        if (String(role.role_name).toLowerCase() === "administrator") {
            return sendError(
                res,
                409,
                "PROTECTED_ROLE",
                "The Administrator role is protected and cannot be deleted."
            );
        }

        const deleted = await roleModel.remove(id);

        if (!deleted) {
            return sendError(
                res,
                404,
                "ROLE_NOT_FOUND",
                "Role not found."
            );
        }

        return res.json({
            success: true,
            message: "Role deleted successfully."
        });
    } catch (error) {
        return handleError("delete", error, res);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
