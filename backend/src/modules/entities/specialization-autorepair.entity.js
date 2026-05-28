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
exports.SpecializationAutorepair = void 0;
var typeorm_1 = require("typeorm");
var autorepair_entity_1 = require("./autorepair.entity");
var specialization_entity_1 = require("./specialization.entity");
var SpecializationAutorepair = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('specialization_autorepairs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _speciltionAutorepairId_decorators;
    var _speciltionAutorepairId_initializers = [];
    var _speciltionAutorepairId_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _engineType_decorators;
    var _engineType_initializers = [];
    var _engineType_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _autorepairId_decorators;
    var _autorepairId_initializers = [];
    var _autorepairId_extraInitializers = [];
    var _speciltionId_decorators;
    var _speciltionId_initializers = [];
    var _speciltionId_extraInitializers = [];
    var _autorepair_decorators;
    var _autorepair_initializers = [];
    var _autorepair_extraInitializers = [];
    var _specialization_decorators;
    var _specialization_initializers = [];
    var _specialization_extraInitializers = [];
    var SpecializationAutorepair = _classThis = /** @class */ (function () {
        function SpecializationAutorepair_1() {
            this.speciltionAutorepairId = __runInitializers(this, _speciltionAutorepairId_initializers, void 0);
            this.model = (__runInitializers(this, _speciltionAutorepairId_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.engineType = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _engineType_initializers, void 0));
            this.year = (__runInitializers(this, _engineType_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.autorepairId = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _autorepairId_initializers, void 0));
            this.speciltionId = (__runInitializers(this, _autorepairId_extraInitializers), __runInitializers(this, _speciltionId_initializers, void 0));
            this.autorepair = (__runInitializers(this, _speciltionId_extraInitializers), __runInitializers(this, _autorepair_initializers, void 0));
            this.specialization = (__runInitializers(this, _autorepair_extraInitializers), __runInitializers(this, _specialization_initializers, void 0));
            __runInitializers(this, _specialization_extraInitializers);
        }
        return SpecializationAutorepair_1;
    }());
    __setFunctionName(_classThis, "SpecializationAutorepair");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _speciltionAutorepairId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'specialtion_autorepair_id' })];
        _model_decorators = [(0, typeorm_1.Column)({ name: 'model', type: 'varchar', length: 100, nullable: true })];
        _engineType_decorators = [(0, typeorm_1.Column)({ name: 'engine_type', type: 'varchar', length: 50, nullable: true })];
        _year_decorators = [(0, typeorm_1.Column)({ name: 'year', type: 'integer', nullable: true })];
        _autorepairId_decorators = [(0, typeorm_1.Column)({ name: 'autorepair_id' })];
        _speciltionId_decorators = [(0, typeorm_1.Column)({ name: 'specialtion_id' })];
        _autorepair_decorators = [(0, typeorm_1.ManyToOne)(function () { return autorepair_entity_1.Autorepair; }, function (autorepair) { return autorepair.specializationAutorepairs; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'autorepair_id' })];
        _specialization_decorators = [(0, typeorm_1.ManyToOne)(function () { return specialization_entity_1.Specialization; }, function (specialization) { return specialization.specializationAutorepairs; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'specialtion_id' })];
        __esDecorate(null, null, _speciltionAutorepairId_decorators, { kind: "field", name: "speciltionAutorepairId", static: false, private: false, access: { has: function (obj) { return "speciltionAutorepairId" in obj; }, get: function (obj) { return obj.speciltionAutorepairId; }, set: function (obj, value) { obj.speciltionAutorepairId = value; } }, metadata: _metadata }, _speciltionAutorepairId_initializers, _speciltionAutorepairId_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _engineType_decorators, { kind: "field", name: "engineType", static: false, private: false, access: { has: function (obj) { return "engineType" in obj; }, get: function (obj) { return obj.engineType; }, set: function (obj, value) { obj.engineType = value; } }, metadata: _metadata }, _engineType_initializers, _engineType_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _autorepairId_decorators, { kind: "field", name: "autorepairId", static: false, private: false, access: { has: function (obj) { return "autorepairId" in obj; }, get: function (obj) { return obj.autorepairId; }, set: function (obj, value) { obj.autorepairId = value; } }, metadata: _metadata }, _autorepairId_initializers, _autorepairId_extraInitializers);
        __esDecorate(null, null, _speciltionId_decorators, { kind: "field", name: "speciltionId", static: false, private: false, access: { has: function (obj) { return "speciltionId" in obj; }, get: function (obj) { return obj.speciltionId; }, set: function (obj, value) { obj.speciltionId = value; } }, metadata: _metadata }, _speciltionId_initializers, _speciltionId_extraInitializers);
        __esDecorate(null, null, _autorepair_decorators, { kind: "field", name: "autorepair", static: false, private: false, access: { has: function (obj) { return "autorepair" in obj; }, get: function (obj) { return obj.autorepair; }, set: function (obj, value) { obj.autorepair = value; } }, metadata: _metadata }, _autorepair_initializers, _autorepair_extraInitializers);
        __esDecorate(null, null, _specialization_decorators, { kind: "field", name: "specialization", static: false, private: false, access: { has: function (obj) { return "specialization" in obj; }, get: function (obj) { return obj.specialization; }, set: function (obj, value) { obj.specialization = value; } }, metadata: _metadata }, _specialization_initializers, _specialization_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SpecializationAutorepair = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SpecializationAutorepair = _classThis;
}();
exports.SpecializationAutorepair = SpecializationAutorepair;
