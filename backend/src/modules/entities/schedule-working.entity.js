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
exports.ScheduleWorking = void 0;
var typeorm_1 = require("typeorm");
var autorepair_entity_1 = require("./autorepair.entity");
var ScheduleWorking = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('schedule_workings')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _scheduleId_decorators;
    var _scheduleId_initializers = [];
    var _scheduleId_extraInitializers = [];
    var _dayOfWeek_decorators;
    var _dayOfWeek_initializers = [];
    var _dayOfWeek_extraInitializers = [];
    var _startTimeWorking_decorators;
    var _startTimeWorking_initializers = [];
    var _startTimeWorking_extraInitializers = [];
    var _endTimeWorking_decorators;
    var _endTimeWorking_initializers = [];
    var _endTimeWorking_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _autorepairId_decorators;
    var _autorepairId_initializers = [];
    var _autorepairId_extraInitializers = [];
    var _autorepair_decorators;
    var _autorepair_initializers = [];
    var _autorepair_extraInitializers = [];
    var ScheduleWorking = _classThis = /** @class */ (function () {
        function ScheduleWorking_1() {
            this.scheduleId = __runInitializers(this, _scheduleId_initializers, void 0);
            this.dayOfWeek = (__runInitializers(this, _scheduleId_extraInitializers), __runInitializers(this, _dayOfWeek_initializers, void 0));
            this.startTimeWorking = (__runInitializers(this, _dayOfWeek_extraInitializers), __runInitializers(this, _startTimeWorking_initializers, void 0));
            this.endTimeWorking = (__runInitializers(this, _startTimeWorking_extraInitializers), __runInitializers(this, _endTimeWorking_initializers, void 0));
            this.comment = (__runInitializers(this, _endTimeWorking_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
            this.autorepairId = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _autorepairId_initializers, void 0));
            this.autorepair = (__runInitializers(this, _autorepairId_extraInitializers), __runInitializers(this, _autorepair_initializers, void 0));
            __runInitializers(this, _autorepair_extraInitializers);
        }
        return ScheduleWorking_1;
    }());
    __setFunctionName(_classThis, "ScheduleWorking");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _scheduleId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'schedule_id' })];
        _dayOfWeek_decorators = [(0, typeorm_1.Column)({ name: 'day_of_week', type: 'varchar', length: 2 })];
        _startTimeWorking_decorators = [(0, typeorm_1.Column)({ name: 'start_time_working', type: 'time', default: '08:00' })];
        _endTimeWorking_decorators = [(0, typeorm_1.Column)({ name: 'end_time_working', type: 'time', default: '18:00' })];
        _comment_decorators = [(0, typeorm_1.Column)({ name: 'comment', type: 'text', nullable: true })];
        _autorepairId_decorators = [(0, typeorm_1.Column)({ name: 'autorepair_id' })];
        _autorepair_decorators = [(0, typeorm_1.ManyToOne)(function () { return autorepair_entity_1.Autorepair; }, function (autorepair) { return autorepair.scheduleWorkings; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'autorepair_id' })];
        __esDecorate(null, null, _scheduleId_decorators, { kind: "field", name: "scheduleId", static: false, private: false, access: { has: function (obj) { return "scheduleId" in obj; }, get: function (obj) { return obj.scheduleId; }, set: function (obj, value) { obj.scheduleId = value; } }, metadata: _metadata }, _scheduleId_initializers, _scheduleId_extraInitializers);
        __esDecorate(null, null, _dayOfWeek_decorators, { kind: "field", name: "dayOfWeek", static: false, private: false, access: { has: function (obj) { return "dayOfWeek" in obj; }, get: function (obj) { return obj.dayOfWeek; }, set: function (obj, value) { obj.dayOfWeek = value; } }, metadata: _metadata }, _dayOfWeek_initializers, _dayOfWeek_extraInitializers);
        __esDecorate(null, null, _startTimeWorking_decorators, { kind: "field", name: "startTimeWorking", static: false, private: false, access: { has: function (obj) { return "startTimeWorking" in obj; }, get: function (obj) { return obj.startTimeWorking; }, set: function (obj, value) { obj.startTimeWorking = value; } }, metadata: _metadata }, _startTimeWorking_initializers, _startTimeWorking_extraInitializers);
        __esDecorate(null, null, _endTimeWorking_decorators, { kind: "field", name: "endTimeWorking", static: false, private: false, access: { has: function (obj) { return "endTimeWorking" in obj; }, get: function (obj) { return obj.endTimeWorking; }, set: function (obj, value) { obj.endTimeWorking = value; } }, metadata: _metadata }, _endTimeWorking_initializers, _endTimeWorking_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _autorepairId_decorators, { kind: "field", name: "autorepairId", static: false, private: false, access: { has: function (obj) { return "autorepairId" in obj; }, get: function (obj) { return obj.autorepairId; }, set: function (obj, value) { obj.autorepairId = value; } }, metadata: _metadata }, _autorepairId_initializers, _autorepairId_extraInitializers);
        __esDecorate(null, null, _autorepair_decorators, { kind: "field", name: "autorepair", static: false, private: false, access: { has: function (obj) { return "autorepair" in obj; }, get: function (obj) { return obj.autorepair; }, set: function (obj, value) { obj.autorepair = value; } }, metadata: _metadata }, _autorepair_initializers, _autorepair_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScheduleWorking = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScheduleWorking = _classThis;
}();
exports.ScheduleWorking = ScheduleWorking;
