const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");
const { runValidation, signupRules, loginRules, employeeCreateRules } = require("../utils/validate");


const uploadToCloudinary = async (base64) => {

    if (!base64) return null;
    const result = await cloudinary.uploader.upload(base64, {
        folder: "comp3133_employeess",
    });
    return result.secure_url;
};

module.exports = {
    Query: {
        login: async (__dirname, { input }) => {
            await runValidation(loginRules, input);

            const user = await User.findOne({
                $or: [{ username: input.usernameOrEmail }, { email: input.usernameOrEmail }],
            });

            if (!user) {
                return { sucess: false, message: "Invalid username/email or password"}
                }
                
            const ok = await bcrypt.compare(input.password, user.password);
            if (!ok) {
                return { sucess: false, message: "Invalid username/email or password"}
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            return {
                success: true,
                message: "Login successful",
                token,
                user,

            };
        },


        getAllEmployees: async () => {
            const employees = await Employee.find().sort({ created_at: -1 });
            return {
                success: true,
                message: "Employees fetched successfully",
                employees,};
        },

        searchEmployeeByEid: async (_, { eid }) => {
            const employee = await Employee.findById(eid);
            if (!employee) {
                return {
                    success: false,
                    message: "Employee not found",
                    employee: null,
                };
            }
            return {
                success: true,
                message: "Employee fetched successfully",
                employee,
            };
        },

        searchEmployees: async (_, { designation, department }) => {
            if (!designation && !department) {
                return {
                    success: false,
                    message: "At least one search criteria (designation or department) is required",
                    employees: [],
                };
            }

            const filter = {};
            if (designation) filter.designation = designation;
            if (department) filter.department = department;

            const employees = await Employee.find(filter).sort({ created_at: -1 });
            return {
                success: true,
                message: "Employees fetched successfully",
                employees};
        },
        
    },

    Mutation : {
        signup: async (_, { input }) => {
            await runValidation(signupRules, input);

            const { username, email, password } = input;

            const exists = await User.findOne({ $or: [{ username }, { email }] });
            if (exists) {
                return {
                    success: false,
                    message: "Username or email already exists",
                };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({ username, email, password: hashedPassword });
            return {
                success: true,
                message: "User registered successfully",
            };        
        },

        addEmployee: async (_, { input }) => {
            await runValidation(employeeCreateRules, input);

            const photoUrl = await uploadToCloudinary(input.employee_Photo_base64);

            try {
                const employee = await Employee.create({
                    first_name: input.first_name,
                    last_name: input.last_name,
                    email: input.email,
                    gender: input.gender,
                    designation: input.designation,
                    salary: input.salary,
                    date_of_joining: new Date(input.date_of_joining),
                    department: input.department,
                    employee_photo: photoUrl,
                });
                return { success: true, message: "Employee added successfully", employee,};
            }   catch (err) {
                if (err.code === 11000) {
                    return { success: false, message: "Failed to add employee", employee: null };
                }
                
                throw err;

            }

        },

        updateEmployeeByEid: async (_, { eid, input }) => {

            if (input.salary !== undefined && input.salary < 1000) {
                return { success: false, message: "Salary must be at least 1000", employee: null };
            }
            if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
                return { success: false, message: "gender must be Male, Female or Other", employee: null };
            }

            let photoUrl = null;
            if (input.employeePhotobase64) {
                photoUrl = await uploadToCloudinary(input.employeePhotobase64);
            }

            const update = {
                ...input,
            };

            if (input.dateOfJoining) update.dateOfJoining = new Date(input.dateOfJoining);
            if (photoUrl) update.employeePhoto = photoUrl;
            
            delete update.employeePhotobase64;

            try {
                const employee = await Employee.findByIdAndUpdate(eid, update, { new: true });
                if (!employee) {
                    return { success: false, message: "Employee not found", employee: null };
                }
                return { success: true, message: "Employee updated successfully", employee };
            } catch (err) {
                if (err.code === 11000) {
                    return { success: false, message: "Failed to update employee", employee: null };
                }
                throw err;
            }
        },

        deleteEmployeeByEid: async (_, { eid }) => {
            const deleted = await Employee.findByIdAndDelete(eid);
            if (!deleted) {
                return { success: false, message: "Employee not found" };
            }
            return { success: true, message: "Employee deleted successfully" };
        },
    },

};