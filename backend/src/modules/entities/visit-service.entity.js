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
exports.VisitService = void 0;
var typeorm_1 = require("typeorm");
var visit_entity_1 = require("./visit.entity");
var autorepair_service_entity_1 = require("./autorepair-service.entity");
var VisitService = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('visit_services')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _visitServiceId_decorators;
    var _visitServiceId_initializers = [];
    var _visitServiceId_extraInitializers = [];
    var _problemDescription_decorators;
    var _problemDescription_initializers = [];
    var _problemDescription_extraInitializers = [];
    var _visitId_decorators;
    var _visitId_initializers = [];
    var _visitId_extraInitializers = [];
    var _autorepairServiceId_decorators;
    var _autorepairServiceId_initializers = [];
    var _autorepairServiceId_extraInitializers = [];
    var _visit_decorators;
    var _visit_initializers = [];
    var _visit_extraInitializers = [];
    var _autorepairService_decorators;
    var _autorepairService_initializers = [];
    var _autorepairService_extraInitializers = [];
    var VisitService = _classThis = /** @class */ (function () {
        function VisitService_1() {
            this.visitServiceId = __runInitializers(this, _visitServiceId_initializers, void 0);
            this.problemDescription = (__runInitializers(this, _visitServiceId_extraInitializers), __runInitializers(this, _problemDescription_initializers, void 0));
            this.visitId = (__runInitializers(this, _problemDescription_extraInitializers), __runInitializers(this, _visitId_initializers, void 0));
            this.autorepairServiceId = (__runInitializers(this, _visitId_extraInitializers), __runInitializers(this, _autorepairServiceId_initializers, void 0));
            this.visit = (__runInitializers(this, _autorepairServiceId_extraInitializers), __runInitializers(this, _visit_initializers, void 0));
            this.autorepairService = (__runInitializers(this, _visit_extraInitializers), __runInitializers(this, _autorepairService_initializers, void 0));
            __runInitializers(this, _autorepairService_extraInitializers);
        }
        return VisitService_1;
    }());
    __setFunctionName(_classThis, "VisitService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _visitServiceId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'visit_service_id' })];
        _problemDescription_decorators = [(0, typeorm_1.Column)({ name: 'problem_description', type: 'text', nullable: true })];
        _visitId_decorators = [(0, typeorm_1.Column)({ name: 'visit_id' })];
        _autorepairServiceId_decorators = [(0, typeorm_1.Column)({ name: 'autorepair_service_id', nullable: true })];
        _visit_decorators = [(0, typeorm_1.ManyToOne)(function () { return visit_entity_1.Visit; }, function (visit) { return visit.visitServices; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'visit_id' })];
        _autorepairService_decorators = [(0, typeorm_1.ManyToOne)(function () { return autorepair_service_entity_1.AutorepairService; }, function (as) { return as.visitServices; }, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'autorepair_service_id' })];
        __esDecorate(null, null, _visitServiceId_decorators, { kind: "field", name: "visitServiceId", static: false, private: false, access: { has: function (obj) { return "visitServiceId" in obj; }, get: function (obj) { return obj.visitServiceId; }, set: function (obj, value) { obj.visitServiceId = value; } }, metadata: _metadata }, _visitServiceId_initializers, _visitServiceId_extraInitializers);
        __esDecorate(null, null, _problemDescription_decorators, { kind: "field", name: "problemDescription", static: false, private: false, access: { has: function (obj) { return "problemDescription" in obj; }, get: function (obj) { return obj.problemDescription; }, set: function (obj, value) { obj.problemDescription = value; } }, metadata: _metadata }, _problemDescription_initializers, _problemDescription_extraInitializers);
        __esDecorate(null, null, _visitId_decorators, { kind: "field", name: "visitId", static: false, private: false, access: { has: function (obj) { return "visitId" in obj; }, get: function (obj) { return obj.visitId; }, set: function (obj, value) { obj.visitId = value; } }, metadata: _metadata }, _visitId_initializers, _visitId_extraInitializers);
        __esDecorate(null, null, _autorepairServiceId_decorators, { kind: "field", name: "autorepairServiceId", static: false, private: false, access: { has: function (obj) { return "autorepairServiceId" in obj; }, get: function (obj) { return obj.autorepairServiceId; }, set: function (obj, value) { obj.autorepairServiceId = value; } }, metadata: _metadata }, _autorepairServiceId_initializers, _autorepairServiceId_extraInitializers);
        __esDecorate(null, null, _visit_decorators, { kind: "field", name: "visit", static: false, private: false, access: { has: function (obj) { return "visit" in obj; }, get: function (obj) { return obj.visit; }, set: function (obj, value) { obj.visit = value; } }, metadata: _metadata }, _visit_initializers, _visit_extraInitializers);
        __esDecorate(null, null, _autorepairService_decorators, { kind: "field", name: "autorepairService", static: false, private: false, access: { has: function (obj) { return "autorepairService" in obj; }, get: function (obj) { return obj.autorepairService; }, set: function (obj, value) { obj.autorepairService = value; } }, metadata: _metadata }, _autorepairService_initializers, _autorepairService_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisitService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisitService = _classThis;
}();
exports.VisitService = VisitService;
