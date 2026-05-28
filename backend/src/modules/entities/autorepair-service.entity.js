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
exports.AutorepairService = void 0;
var typeorm_1 = require("typeorm");
var autorepair_entity_1 = require("./autorepair.entity");
var service_entity_1 = require("./service.entity");
var visit_service_entity_1 = require("./visit-service.entity");
var AutorepairService = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('autorepair_services')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _autorepairServiceId_decorators;
    var _autorepairServiceId_initializers = [];
    var _autorepairServiceId_extraInitializers = [];
    var _autorepairId_decorators;
    var _autorepairId_initializers = [];
    var _autorepairId_extraInitializers = [];
    var _serviceId_decorators;
    var _serviceId_initializers = [];
    var _serviceId_extraInitializers = [];
    var _servicePrice_decorators;
    var _servicePrice_initializers = [];
    var _servicePrice_extraInitializers = [];
    var _garantieTerm_decorators;
    var _garantieTerm_initializers = [];
    var _garantieTerm_extraInitializers = [];
    var _duration_decorators;
    var _duration_initializers = [];
    var _duration_extraInitializers = [];
    var _autorepair_decorators;
    var _autorepair_initializers = [];
    var _autorepair_extraInitializers = [];
    var _service_decorators;
    var _service_initializers = [];
    var _service_extraInitializers = [];
    var _visitServices_decorators;
    var _visitServices_initializers = [];
    var _visitServices_extraInitializers = [];
    var AutorepairService = _classThis = /** @class */ (function () {
        function AutorepairService_1() {
            this.autorepairServiceId = __runInitializers(this, _autorepairServiceId_initializers, void 0);
            this.autorepairId = (__runInitializers(this, _autorepairServiceId_extraInitializers), __runInitializers(this, _autorepairId_initializers, void 0));
            this.serviceId = (__runInitializers(this, _autorepairId_extraInitializers), __runInitializers(this, _serviceId_initializers, void 0));
            this.servicePrice = (__runInitializers(this, _serviceId_extraInitializers), __runInitializers(this, _servicePrice_initializers, void 0));
            this.garantieTerm = (__runInitializers(this, _servicePrice_extraInitializers), __runInitializers(this, _garantieTerm_initializers, void 0));
            this.duration = (__runInitializers(this, _garantieTerm_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.autorepair = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _autorepair_initializers, void 0));
            this.service = (__runInitializers(this, _autorepair_extraInitializers), __runInitializers(this, _service_initializers, void 0));
            this.visitServices = (__runInitializers(this, _service_extraInitializers), __runInitializers(this, _visitServices_initializers, void 0));
            __runInitializers(this, _visitServices_extraInitializers);
        }
        return AutorepairService_1;
    }());
    __setFunctionName(_classThis, "AutorepairService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _autorepairServiceId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'autorepair_service_id' })];
        _autorepairId_decorators = [(0, typeorm_1.Column)({ name: 'autorepair_id' })];
        _serviceId_decorators = [(0, typeorm_1.Column)({ name: 'service_id' })];
        _servicePrice_decorators = [(0, typeorm_1.Column)({ name: 'service_price', type: 'decimal', precision: 10, scale: 2 })];
        _garantieTerm_decorators = [(0, typeorm_1.Column)({ name: 'garantie_term', type: 'integer', nullable: true })];
        _duration_decorators = [(0, typeorm_1.Column)({ name: 'duration', type: 'integer' })];
        _autorepair_decorators = [(0, typeorm_1.ManyToOne)(function () { return autorepair_entity_1.Autorepair; }, function (autorepair) { return autorepair.autorepairServices; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'autorepair_id' })];
        _service_decorators = [(0, typeorm_1.ManyToOne)(function () { return service_entity_1.Service; }, function (service) { return service.autorepairServices; }, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'service_id' })];
        _visitServices_decorators = [(0, typeorm_1.OneToMany)(function () { return visit_service_entity_1.VisitService; }, function (vs) { return vs.autorepairService; })];
        __esDecorate(null, null, _autorepairServiceId_decorators, { kind: "field", name: "autorepairServiceId", static: false, private: false, access: { has: function (obj) { return "autorepairServiceId" in obj; }, get: function (obj) { return obj.autorepairServiceId; }, set: function (obj, value) { obj.autorepairServiceId = value; } }, metadata: _metadata }, _autorepairServiceId_initializers, _autorepairServiceId_extraInitializers);
        __esDecorate(null, null, _autorepairId_decorators, { kind: "field", name: "autorepairId", static: false, private: false, access: { has: function (obj) { return "autorepairId" in obj; }, get: function (obj) { return obj.autorepairId; }, set: function (obj, value) { obj.autorepairId = value; } }, metadata: _metadata }, _autorepairId_initializers, _autorepairId_extraInitializers);
        __esDecorate(null, null, _serviceId_decorators, { kind: "field", name: "serviceId", static: false, private: false, access: { has: function (obj) { return "serviceId" in obj; }, get: function (obj) { return obj.serviceId; }, set: function (obj, value) { obj.serviceId = value; } }, metadata: _metadata }, _serviceId_initializers, _serviceId_extraInitializers);
        __esDecorate(null, null, _servicePrice_decorators, { kind: "field", name: "servicePrice", static: false, private: false, access: { has: function (obj) { return "servicePrice" in obj; }, get: function (obj) { return obj.servicePrice; }, set: function (obj, value) { obj.servicePrice = value; } }, metadata: _metadata }, _servicePrice_initializers, _servicePrice_extraInitializers);
        __esDecorate(null, null, _garantieTerm_decorators, { kind: "field", name: "garantieTerm", static: false, private: false, access: { has: function (obj) { return "garantieTerm" in obj; }, get: function (obj) { return obj.garantieTerm; }, set: function (obj, value) { obj.garantieTerm = value; } }, metadata: _metadata }, _garantieTerm_initializers, _garantieTerm_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: function (obj) { return "duration" in obj; }, get: function (obj) { return obj.duration; }, set: function (obj, value) { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _autorepair_decorators, { kind: "field", name: "autorepair", static: false, private: false, access: { has: function (obj) { return "autorepair" in obj; }, get: function (obj) { return obj.autorepair; }, set: function (obj, value) { obj.autorepair = value; } }, metadata: _metadata }, _autorepair_initializers, _autorepair_extraInitializers);
        __esDecorate(null, null, _service_decorators, { kind: "field", name: "service", static: false, private: false, access: { has: function (obj) { return "service" in obj; }, get: function (obj) { return obj.service; }, set: function (obj, value) { obj.service = value; } }, metadata: _metadata }, _service_initializers, _service_extraInitializers);
        __esDecorate(null, null, _visitServices_decorators, { kind: "field", name: "visitServices", static: false, private: false, access: { has: function (obj) { return "visitServices" in obj; }, get: function (obj) { return obj.visitServices; }, set: function (obj, value) { obj.visitServices = value; } }, metadata: _metadata }, _visitServices_initializers, _visitServices_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AutorepairService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AutorepairService = _classThis;
}();
exports.AutorepairService = AutorepairService;
