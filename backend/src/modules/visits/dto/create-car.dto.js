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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCarDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreateCarDto = function () {
    var _a;
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
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCarDto() {
                this.brand = __runInitializers(this, _brand_initializers, void 0);
                this.model = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.engineType = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _engineType_initializers, void 0));
                this.year = (__runInitializers(this, _engineType_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.licensePlate = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
                this.vin = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
                __runInitializers(this, _vin_extraInitializers);
            }
            return CreateCarDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _brand_decorators = [(0, class_validator_1.IsString)()];
            _model_decorators = [(0, class_validator_1.IsString)()];
            _engineType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _year_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (value === '' || value == null ? undefined : Number(value));
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1886), (0, class_validator_1.Max)(new Date().getFullYear() + 1)];
            _licensePlate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vin_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^[A-Za-z0-9]{6,17}$/, { message: 'VIN should be 6-17 alphanumeric' })];
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _engineType_decorators, { kind: "field", name: "engineType", static: false, private: false, access: { has: function (obj) { return "engineType" in obj; }, get: function (obj) { return obj.engineType; }, set: function (obj, value) { obj.engineType = value; } }, metadata: _metadata }, _engineType_initializers, _engineType_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
            __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCarDto = CreateCarDto;
