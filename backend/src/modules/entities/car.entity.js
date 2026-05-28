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
exports.Car = void 0;
var typeorm_1 = require("typeorm");
var client_entity_1 = require("./client.entity");
var visit_entity_1 = require("./visit.entity");
var Car = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('cars')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _carId_decorators;
    var _carId_initializers = [];
    var _carId_extraInitializers = [];
    var _brand_decorators;
    var _brand_initializers = [];
    var _brand_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _engineType_decorators;
    var _engineType_initializers = [];
    var _engineType_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _insurance_decorators;
    var _insurance_initializers = [];
    var _insurance_extraInitializers = [];
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    var _clientId_decorators;
    var _clientId_initializers = [];
    var _clientId_extraInitializers = [];
    var _client_decorators;
    var _client_initializers = [];
    var _client_extraInitializers = [];
    var _visits_decorators;
    var _visits_initializers = [];
    var _visits_extraInitializers = [];
    var Car = _classThis = /** @class */ (function () {
        function Car_1() {
            this.carId = __runInitializers(this, _carId_initializers, void 0);
            this.brand = (__runInitializers(this, _carId_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
            this.model = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.engineType = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _engineType_initializers, void 0));
            this.year = (__runInitializers(this, _engineType_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.insurance = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _insurance_initializers, void 0));
            this.licensePlate = (__runInitializers(this, _insurance_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
            this.vin = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
            this.clientId = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.client = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _client_initializers, void 0));
            this.visits = (__runInitializers(this, _client_extraInitializers), __runInitializers(this, _visits_initializers, void 0));
            __runInitializers(this, _visits_extraInitializers);
        }
        return Car_1;
    }());
    __setFunctionName(_classThis, "Car");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _carId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'car_id' })];
        _brand_decorators = [(0, typeorm_1.Column)({ name: 'brand', type: 'varchar', length: 100, nullable: true })];
        _model_decorators = [(0, typeorm_1.Column)({ name: 'model', type: 'varchar', length: 100, nullable: true })];
        _engineType_decorators = [(0, typeorm_1.Column)({ name: 'engine_type', type: 'varchar', length: 50, nullable: true })];
        _year_decorators = [(0, typeorm_1.Column)({ name: 'year', type: 'integer', nullable: true })];
        _insurance_decorators = [(0, typeorm_1.Column)({ name: 'insurance', type: 'timestamp', nullable: true })];
        _licensePlate_decorators = [(0, typeorm_1.Column)({ name: 'license_plate', type: 'varchar', length: 15, unique: true })];
        _vin_decorators = [(0, typeorm_1.Column)({ name: 'vin', type: 'varchar', length: 50, unique: true })];
        _clientId_decorators = [(0, typeorm_1.Column)({ name: 'client_id' })];
        _client_decorators = [(0, typeorm_1.ManyToOne)(function () { return client_entity_1.Client; }, function (client) { return client.cars; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'client_id' })];
        _visits_decorators = [(0, typeorm_1.OneToMany)(function () { return visit_entity_1.Visit; }, function (visit) { return visit.car; })];
        __esDecorate(null, null, _carId_decorators, { kind: "field", name: "carId", static: false, private: false, access: { has: function (obj) { return "carId" in obj; }, get: function (obj) { return obj.carId; }, set: function (obj, value) { obj.carId = value; } }, metadata: _metadata }, _carId_initializers, _carId_extraInitializers);
        __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _engineType_decorators, { kind: "field", name: "engineType", static: false, private: false, access: { has: function (obj) { return "engineType" in obj; }, get: function (obj) { return obj.engineType; }, set: function (obj, value) { obj.engineType = value; } }, metadata: _metadata }, _engineType_initializers, _engineType_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _insurance_decorators, { kind: "field", name: "insurance", static: false, private: false, access: { has: function (obj) { return "insurance" in obj; }, get: function (obj) { return obj.insurance; }, set: function (obj, value) { obj.insurance = value; } }, metadata: _metadata }, _insurance_initializers, _insurance_extraInitializers);
        __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
        __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: function (obj) { return "clientId" in obj; }, get: function (obj) { return obj.clientId; }, set: function (obj, value) { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _client_decorators, { kind: "field", name: "client", static: false, private: false, access: { has: function (obj) { return "client" in obj; }, get: function (obj) { return obj.client; }, set: function (obj, value) { obj.client = value; } }, metadata: _metadata }, _client_initializers, _client_extraInitializers);
        __esDecorate(null, null, _visits_decorators, { kind: "field", name: "visits", static: false, private: false, access: { has: function (obj) { return "visits" in obj; }, get: function (obj) { return obj.visits; }, set: function (obj, value) { obj.visits = value; } }, metadata: _metadata }, _visits_initializers, _visits_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Car = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Car = _classThis;
}();
exports.Car = Car;
