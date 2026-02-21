const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type GenericResponse {
    success: Boolean!
    message: String!
  }

  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  type EmployeesResponse {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo_base64: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo_base64: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!

    getAllEmployees: EmployeesResponse!
    searchEmployeeByEid(eid: ID!): EmployeeResponse!
    searchEmployees(designation: String, department: String): EmployeesResponse!
  }

  type Mutation {
    signup(input: SignupInput!): GenericResponse!

    addEmployee(input: EmployeeInput!): EmployeeResponse!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): EmployeeResponse!
    deleteEmployeeByEid(eid: ID!): GenericResponse!
  }
`;