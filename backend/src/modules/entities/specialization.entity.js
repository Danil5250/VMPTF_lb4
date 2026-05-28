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
exports.Specialization = void 0;
var typeorm_1 = require("typeorm");
var specialization_autorepair_entity_1 = require("./specialization-autorepair.entity");
var Specialization = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('specializations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _speciltionId_decorators;
    var _speciltionId_initializers = [];
    var _speciltionId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _specializationAutorepairs_decorators;
    var _specializationAutorepairs_initializers = [];
    var _specializationAutorepairs_extraInitializers = [];
    var Specialization = _classThis = /** @class */ (function () {
        function Specialization_1() {
            this.speciltionId = __runInitializers(this, _speciltionId_initializers, void 0);
            this.name = (__runInitializers(this, _speciltionId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.specializationAutorepairs = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _specializationAutorepairs_initializers, void 0));
            __runInitializers(this, _specializationAutorepairs_extraInitializers);
        }
        return Specialization_1;
    }());
    __setFunctionName(_classThis, "Specialization");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _speciltionId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'specialtion_id' })];
        _name_decorators = [(0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 })];
        _specializationAutorepairs_decorators = [(0, typeorm_1.OneToMany)(function () { return specialization_autorepair_entity_1.SpecializationAutorepair; }, function (sa) { return sa.specialization; })];
        __esDecorate(null, null, _speciltionId_decorators, { kind: "field", name: "speciltionId", static: false, private: false, access: { has: function (obj) { return "speciltionId" in obj; }, get: function (obj) { return obj.speciltionId; }, set: function (obj, value) { obj.speciltionId = value; } }, metadata: _metadata }, _speciltionId_initializers, _speciltionId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _specializationAutorepairs_decorators, { kind: "field", name: "specializationAutorepairs", static: false, private: false, access: { has: function (obj) { return "specializationAutorepairs" in obj; }, get: function (obj) { return obj.specializationAutorepairs; }, set: function (obj, value) { obj.specializationAutorepairs = value; } }, metadata: _metadata }, _specializationAutorepairs_initializers, _specializationAutorepairs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Specialization = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Specialization = _classThis;
}();
exports.Specialization = Specialization;
