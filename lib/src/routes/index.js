"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const account_controller_1 = require("../controllers/account.controller");
exports.router = (0, express_1.Router)();
const accountController = new account_controller_1.AccountController();
exports.router.route('/').post(accountController.createAccount);
