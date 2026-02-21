const { body, validationResult } = require("express-validator");

const runValidation = async (validations, data) => {
    const req = { body: data };

    for (const validation of validations) {
        await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map(e => e.msg).join(", ");
        const err = new Error(msg);
        err.status = 400;
        throw err;
    }
};
    const signupRules = [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    ];

    const loginRules = [
        body("usernameOrEmail").notEmpty().withMessage("Username or email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ];


    const employeeCreateRules = [
        body("first_name").notEmpty().withMessage("First name is required"),
        body("last_name").notEmpty().withMessage("Last name is required"),
        body("email").notEmpty().isEmail().withMessage("Valid email is required"),
        body("gender").notEmpty().isIn(["Male", "Female", "Other"]).withMessage("Valid gender is required"),
        body("designation").notEmpty().withMessage("Designation is required"),
        body("department").notEmpty().withMessage("Department is required"),
        body("salary").notEmpty().withMessage("Salary is required").isFloat({ min: 1000 }).withMessage("Salary must be at least 1000"),
        body("date_of_joining").notEmpty().withMessage("Date of joining is required"),
        
    ];

    module.exports = {
        runValidation,
        signupRules,
        loginRules,
        employeeCreateRules,
    };