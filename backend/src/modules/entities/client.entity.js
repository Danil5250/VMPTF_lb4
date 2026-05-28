"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var typeorm_1 = require("typeorm");
var car_entity_1 = require("./car.entity");
var Client = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('clients'), (0, typeorm_1.Unique)(['name', 'email'])];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _clientId_decorators;
    var _clientId_initializers = [];
    var _clientId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _surname_decorators;
    var _surname_initializers = [];
    var _surname_extraInitializers = [];
    var _middlename_decorators;
    var _middlename_initializers = [];
    var _middlename_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _login_decorators;
    var _login_initializers = [];
    var _login_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _cars_decorators;
    var _cars_initializers = [];
    var _cars_extraInitializers = [];
    var Client = _classThis = /** @class */ (function () {
        function Client_1() {
            this.clientId = __runInitializers(this, _clientId_initializers, void 0);
            this.name = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.surname = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _surname_initializers, void 0));
            this.middlename = (__runInitializers(this, _surname_extraInitializers), __runInitializers(this, _middlename_initializers, void 0));
            this.email = (__runInitializers(this, _middlename_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.login = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _login_initializers, void 0));
            this.password = (__runInitializers(this, _login_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.cars = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _cars_initializers, void 0));
            __runInitializers(this, _cars_extraInitializers);
        }
        return Client_1;
    }());
    __setFunctionName(_classThis, "Client");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _clientId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'client_id' })];
        _name_decorators = [(0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255, default: 'UNKNOWN' })];
        _surname_decorators = [(0, typeorm_1.Column)({ name: 'surname', type: 'varchar', length: 255, nullable: true })];
        _middlename_decorators = [(0, typeorm_1.Column)({ name: 'middlename', type: 'varchar', length: 255, nullable: true })];
        _email_decorators = [(0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255 })];
        _phone_decorators = [(0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 50, nullable: true })];
        _login_decorators = [(0, typeorm_1.Column)({ name: 'login', type: 'varchar', length: 100, unique: true, nullable: true })];
        _password_decorators = [(0, typeorm_1.Column)({ name: 'password', type: 'varchar', length: 255, nullable: true })];
        _cars_decorators = [(0, typeorm_1.OneToMany)(function () { return car_entity_1.Car; }, function (car) { return car.client; })];
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: function (obj) { return "clientId" in obj; }, get: function (obj) { return obj.clientId; }, set: function (obj, value) { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _surname_decorators, { kind: "field", name: "surname", static: false, private: false, access: { has: function (obj) { return "surname" in obj; }, get: function (obj) { return obj.surname; }, set: function (obj, value) { obj.surname = value; } }, metadata: _metadata }, _surname_initializers, _surname_extraInitializers);
        __esDecorate(null, null, _middlename_decorators, { kind: "field", name: "middlename", static: false, private: false, access: { has: function (obj) { return "middlename" in obj; }, get: function (obj) { return obj.middlename; }, set: function (obj, value) { obj.middlename = value; } }, metadata: _metadata }, _middlename_initializers, _middlename_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _login_decorators, { kind: "field", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; }, set: function (obj, value) { obj.login = value; } }, metadata: _metadata }, _login_initializers, _login_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _cars_decorators, { kind: "field", name: "cars", static: false, private: false, access: { has: function (obj) { return "cars" in obj; }, get: function (obj) { return obj.cars; }, set: function (obj, value) { obj.cars = value; } }, metadata: _metadata }, _cars_initializers, _cars_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Client = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Client = _classThis;
}();
exports.Client = Client;
