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
exports.Visit = void 0;
var typeorm_1 = require("typeorm");
var car_entity_1 = require("./car.entity");
var autorepair_entity_1 = require("./autorepair.entity");
var visit_service_entity_1 = require("./visit-service.entity");
var Visit = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('visits')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _visitId_decorators;
    var _visitId_initializers = [];
    var _visitId_extraInitializers = [];
    var _dateTime_decorators;
    var _dateTime_initializers = [];
    var _dateTime_extraInitializers = [];
    var _alternativeDateTime_decorators;
    var _alternativeDateTime_initializers = [];
    var _alternativeDateTime_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _paymentWay_decorators;
    var _paymentWay_initializers = [];
    var _paymentWay_extraInitializers = [];
    var _paymentStatus_decorators;
    var _paymentStatus_initializers = [];
    var _paymentStatus_extraInitializers = [];
    var _isCompleted_decorators;
    var _isCompleted_initializers = [];
    var _isCompleted_extraInitializers = [];
    var _isUrgent_decorators;
    var _isUrgent_initializers = [];
    var _isUrgent_extraInitializers = [];
    var _carId_decorators;
    var _carId_initializers = [];
    var _carId_extraInitializers = [];
    var _autorepairId_decorators;
    var _autorepairId_initializers = [];
    var _autorepairId_extraInitializers = [];
    var _car_decorators;
    var _car_initializers = [];
    var _car_extraInitializers = [];
    var _autorepair_decorators;
    var _autorepair_initializers = [];
    var _autorepair_extraInitializers = [];
    var _visitServices_decorators;
    var _visitServices_initializers = [];
    var _visitServices_extraInitializers = [];
    var Visit = _classThis = /** @class */ (function () {
        function Visit_1() {
            this.visitId = __runInitializers(this, _visitId_initializers, void 0);
            this.dateTime = (__runInitializers(this, _visitId_extraInitializers), __runInitializers(this, _dateTime_initializers, void 0));
            this.alternativeDateTime = (__runInitializers(this, _dateTime_extraInitializers), __runInitializers(this, _alternativeDateTime_initializers, void 0));
            this.note = (__runInitializers(this, _alternativeDateTime_extraInitializers), __runInitializers(this, _note_initializers, void 0));
            this.paymentWay = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _paymentWay_initializers, void 0));
            this.paymentStatus = (__runInitializers(this, _paymentWay_extraInitializers), __runInitializers(this, _paymentStatus_initializers, void 0));
            this.isCompleted = (__runInitializers(this, _paymentStatus_extraInitializers), __runInitializers(this, _isCompleted_initializers, void 0));
            this.isUrgent = (__runInitializers(this, _isCompleted_extraInitializers), __runInitializers(this, _isUrgent_initializers, void 0));
            this.carId = (__runInitializers(this, _isUrgent_extraInitializers), __runInitializers(this, _carId_initializers, void 0));
            this.autorepairId = (__runInitializers(this, _carId_extraInitializers), __runInitializers(this, _autorepairId_initializers, void 0));
            this.car = (__runInitializers(this, _autorepairId_extraInitializers), __runInitializers(this, _car_initializers, void 0));
            this.autorepair = (__runInitializers(this, _car_extraInitializers), __runInitializers(this, _autorepair_initializers, void 0));
            this.visitServices = (__runInitializers(this, _autorepair_extraInitializers), __runInitializers(this, _visitServices_initializers, void 0));
            __runInitializers(this, _visitServices_extraInitializers);
        }
        return Visit_1;
    }());
    __setFunctionName(_classThis, "Visit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _visitId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'visit_id' })];
        _dateTime_decorators = [(0, typeorm_1.Column)({ name: 'date_time', type: 'timestamp', nullable: true })];
        _alternativeDateTime_decorators = [(0, typeorm_1.Column)({ name: 'alternative_date_time', type: 'timestamp', nullable: true })];
        _note_decorators = [(0, typeorm_1.Column)({ name: 'note', type: 'text', nullable: true })];
        _paymentWay_decorators = [(0, typeorm_1.Column)({ name: 'payment_way', type: 'varchar', length: 10, default: 'готівка' })];
        _paymentStatus_decorators = [(0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar', length: 15, default: 'не оплачено' })];
        _isCompleted_decorators = [(0, typeorm_1.Column)({ name: 'is_completed', type: 'boolean', default: false })];
        _isUrgent_decorators = [(0, typeorm_1.Column)({ name: 'is_urgent', type: 'boolean', default: false })];
        _carId_decorators = [(0, typeorm_1.Column)({ name: 'car_id' })];
        _autorepairId_decorators = [(0, typeorm_1.Column)({ name: 'autorepair_id', nullable: true })];
        _car_decorators = [(0, typeorm_1.ManyToOne)(function () { return car_entity_1.Car; }, function (car) { return car.visits; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'car_id' })];
        _autorepair_decorators = [(0, typeorm_1.ManyToOne)(function () { return autorepair_entity_1.Autorepair; }, function (autorepair) { return autorepair.visits; }, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'autorepair_id' })];
        _visitServices_decorators = [(0, typeorm_1.OneToMany)(function () { return visit_service_entity_1.VisitService; }, function (vs) { return vs.visit; })];
        __esDecorate(null, null, _visitId_decorators, { kind: "field", name: "visitId", static: false, private: false, access: { has: function (obj) { return "visitId" in obj; }, get: function (obj) { return obj.visitId; }, set: function (obj, value) { obj.visitId = value; } }, metadata: _metadata }, _visitId_initializers, _visitId_extraInitializers);
        __esDecorate(null, null, _dateTime_decorators, { kind: "field", name: "dateTime", static: false, private: false, access: { has: function (obj) { return "dateTime" in obj; }, get: function (obj) { return obj.dateTime; }, set: function (obj, value) { obj.dateTime = value; } }, metadata: _metadata }, _dateTime_initializers, _dateTime_extraInitializers);
        __esDecorate(null, null, _alternativeDateTime_decorators, { kind: "field", name: "alternativeDateTime", static: false, private: false, access: { has: function (obj) { return "alternativeDateTime" in obj; }, get: function (obj) { return obj.alternativeDateTime; }, set: function (obj, value) { obj.alternativeDateTime = value; } }, metadata: _metadata }, _alternativeDateTime_initializers, _alternativeDateTime_extraInitializers);
        __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
        __esDecorate(null, null, _paymentWay_decorators, { kind: "field", name: "paymentWay", static: false, private: false, access: { has: function (obj) { return "paymentWay" in obj; }, get: function (obj) { return obj.paymentWay; }, set: function (obj, value) { obj.paymentWay = value; } }, metadata: _metadata }, _paymentWay_initializers, _paymentWay_extraInitializers);
        __esDecorate(null, null, _paymentStatus_decorators, { kind: "field", name: "paymentStatus", static: false, private: false, access: { has: function (obj) { return "paymentStatus" in obj; }, get: function (obj) { return obj.paymentStatus; }, set: function (obj, value) { obj.paymentStatus = value; } }, metadata: _metadata }, _paymentStatus_initializers, _paymentStatus_extraInitializers);
        __esDecorate(null, null, _isCompleted_decorators, { kind: "field", name: "isCompleted", static: false, private: false, access: { has: function (obj) { return "isCompleted" in obj; }, get: function (obj) { return obj.isCompleted; }, set: function (obj, value) { obj.isCompleted = value; } }, metadata: _metadata }, _isCompleted_initializers, _isCompleted_extraInitializers);
        __esDecorate(null, null, _isUrgent_decorators, { kind: "field", name: "isUrgent", static: false, private: false, access: { has: function (obj) { return "isUrgent" in obj; }, get: function (obj) { return obj.isUrgent; }, set: function (obj, value) { obj.isUrgent = value; } }, metadata: _metadata }, _isUrgent_initializers, _isUrgent_extraInitializers);
        __esDecorate(null, null, _carId_decorators, { kind: "field", name: "carId", static: false, private: false, access: { has: function (obj) { return "carId" in obj; }, get: function (obj) { return obj.carId; }, set: function (obj, value) { obj.carId = value; } }, metadata: _metadata }, _carId_initializers, _carId_extraInitializers);
        __esDecorate(null, null, _autorepairId_decorators, { kind: "field", name: "autorepairId", static: false, private: false, access: { has: function (obj) { return "autorepairId" in obj; }, get: function (obj) { return obj.autorepairId; }, set: function (obj, value) { obj.autorepairId = value; } }, metadata: _metadata }, _autorepairId_initializers, _autorepairId_extraInitializers);
        __esDecorate(null, null, _car_decorators, { kind: "field", name: "car", static: false, private: false, access: { has: function (obj) { return "car" in obj; }, get: function (obj) { return obj.car; }, set: function (obj, value) { obj.car = value; } }, metadata: _metadata }, _car_initializers, _car_extraInitializers);
        __esDecorate(null, null, _autorepair_decorators, { kind: "field", name: "autorepair", static: false, private: false, access: { has: function (obj) { return "autorepair" in obj; }, get: function (obj) { return obj.autorepair; }, set: function (obj, value) { obj.autorepair = value; } }, metadata: _metadata }, _autorepair_initializers, _autorepair_extraInitializers);
        __esDecorate(null, null, _visitServices_decorators, { kind: "field", name: "visitServices", static: false, private: false, access: { has: function (obj) { return "visitServices" in obj; }, get: function (obj) { return obj.visitServices; }, set: function (obj, value) { obj.visitServices = value; } }, metadata: _metadata }, _visitServices_initializers, _visitServices_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Visit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Visit = _classThis;
}();
exports.Visit = Visit;
