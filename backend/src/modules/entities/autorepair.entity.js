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
exports.Autorepair = void 0;
var typeorm_1 = require("typeorm");
var visit_entity_1 = require("./visit.entity");
var autorepair_service_entity_1 = require("./autorepair-service.entity");
var schedule_working_entity_1 = require("./schedule-working.entity");
var specialization_autorepair_entity_1 = require("./specialization-autorepair.entity");
var Autorepair = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('autorepairs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _autorepairId_decorators;
    var _autorepairId_initializers = [];
    var _autorepairId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _adress_decorators;
    var _adress_initializers = [];
    var _adress_extraInitializers = [];
    var _index_decorators;
    var _index_initializers = [];
    var _index_extraInitializers = [];
    var _workersAmount_decorators;
    var _workersAmount_initializers = [];
    var _workersAmount_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _ranking_decorators;
    var _ranking_initializers = [];
    var _ranking_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _visits_decorators;
    var _visits_initializers = [];
    var _visits_extraInitializers = [];
    var _autorepairServices_decorators;
    var _autorepairServices_initializers = [];
    var _autorepairServices_extraInitializers = [];
    var _scheduleWorkings_decorators;
    var _scheduleWorkings_initializers = [];
    var _scheduleWorkings_extraInitializers = [];
    var _specializationAutorepairs_decorators;
    var _specializationAutorepairs_initializers = [];
    var _specializationAutorepairs_extraInitializers = [];
    var Autorepair = _classThis = /** @class */ (function () {
        function Autorepair_1() {
            this.autorepairId = __runInitializers(this, _autorepairId_initializers, void 0);
            this.name = (__runInitializers(this, _autorepairId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.adress = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _adress_initializers, void 0));
            this.index = (__runInitializers(this, _adress_extraInitializers), __runInitializers(this, _index_initializers, void 0));
            this.workersAmount = (__runInitializers(this, _index_extraInitializers), __runInitializers(this, _workersAmount_initializers, void 0));
            this.phone = (__runInitializers(this, _workersAmount_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.email = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.ranking = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _ranking_initializers, void 0));
            this.password = (__runInitializers(this, _ranking_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.visits = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _visits_initializers, void 0));
            this.autorepairServices = (__runInitializers(this, _visits_extraInitializers), __runInitializers(this, _autorepairServices_initializers, void 0));
            this.scheduleWorkings = (__runInitializers(this, _autorepairServices_extraInitializers), __runInitializers(this, _scheduleWorkings_initializers, void 0));
            this.specializationAutorepairs = (__runInitializers(this, _scheduleWorkings_extraInitializers), __runInitializers(this, _specializationAutorepairs_initializers, void 0));
            __runInitializers(this, _specializationAutorepairs_extraInitializers);
        }
        return Autorepair_1;
    }());
    __setFunctionName(_classThis, "Autorepair");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _autorepairId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'autorepair_id' })];
        _name_decorators = [(0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255, unique: true })];
        _description_decorators = [(0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true })];
        _adress_decorators = [(0, typeorm_1.Column)({ name: 'adress', type: 'text', nullable: true })];
        _index_decorators = [(0, typeorm_1.Column)({ name: 'index', type: 'varchar', length: 20, nullable: true })];
        _workersAmount_decorators = [(0, typeorm_1.Column)({ name: 'workers_amount', type: 'integer', default: 1 })];
        _phone_decorators = [(0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 50, nullable: true })];
        _email_decorators = [(0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, nullable: true })];
        _ranking_decorators = [(0, typeorm_1.Column)({ name: 'ranking', type: 'decimal', precision: 3, scale: 2, default: 0.00 })];
        _password_decorators = [(0, typeorm_1.Column)({ name: 'password', type: 'varchar', length: 100, nullable: true })];
        _visits_decorators = [(0, typeorm_1.OneToMany)(function () { return visit_entity_1.Visit; }, function (visit) { return visit.autorepair; })];
        _autorepairServices_decorators = [(0, typeorm_1.OneToMany)(function () { return autorepair_service_entity_1.AutorepairService; }, function (as) { return as.autorepair; })];
        _scheduleWorkings_decorators = [(0, typeorm_1.OneToMany)(function () { return schedule_working_entity_1.ScheduleWorking; }, function (sw) { return sw.autorepair; })];
        _specializationAutorepairs_decorators = [(0, typeorm_1.OneToMany)(function () { return specialization_autorepair_entity_1.SpecializationAutorepair; }, function (sa) { return sa.autorepair; })];
        __esDecorate(null, null, _autorepairId_decorators, { kind: "field", name: "autorepairId", static: false, private: false, access: { has: function (obj) { return "autorepairId" in obj; }, get: function (obj) { return obj.autorepairId; }, set: function (obj, value) { obj.autorepairId = value; } }, metadata: _metadata }, _autorepairId_initializers, _autorepairId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _adress_decorators, { kind: "field", name: "adress", static: false, private: false, access: { has: function (obj) { return "adress" in obj; }, get: function (obj) { return obj.adress; }, set: function (obj, value) { obj.adress = value; } }, metadata: _metadata }, _adress_initializers, _adress_extraInitializers);
        __esDecorate(null, null, _index_decorators, { kind: "field", name: "index", static: false, private: false, access: { has: function (obj) { return "index" in obj; }, get: function (obj) { return obj.index; }, set: function (obj, value) { obj.index = value; } }, metadata: _metadata }, _index_initializers, _index_extraInitializers);
        __esDecorate(null, null, _workersAmount_decorators, { kind: "field", name: "workersAmount", static: false, private: false, access: { has: function (obj) { return "workersAmount" in obj; }, get: function (obj) { return obj.workersAmount; }, set: function (obj, value) { obj.workersAmount = value; } }, metadata: _metadata }, _workersAmount_initializers, _workersAmount_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _ranking_decorators, { kind: "field", name: "ranking", static: false, private: false, access: { has: function (obj) { return "ranking" in obj; }, get: function (obj) { return obj.ranking; }, set: function (obj, value) { obj.ranking = value; } }, metadata: _metadata }, _ranking_initializers, _ranking_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _visits_decorators, { kind: "field", name: "visits", static: false, private: false, access: { has: function (obj) { return "visits" in obj; }, get: function (obj) { return obj.visits; }, set: function (obj, value) { obj.visits = value; } }, metadata: _metadata }, _visits_initializers, _visits_extraInitializers);
        __esDecorate(null, null, _autorepairServices_decorators, { kind: "field", name: "autorepairServices", static: false, private: false, access: { has: function (obj) { return "autorepairServices" in obj; }, get: function (obj) { return obj.autorepairServices; }, set: function (obj, value) { obj.autorepairServices = value; } }, metadata: _metadata }, _autorepairServices_initializers, _autorepairServices_extraInitializers);
        __esDecorate(null, null, _scheduleWorkings_decorators, { kind: "field", name: "scheduleWorkings", static: false, private: false, access: { has: function (obj) { return "scheduleWorkings" in obj; }, get: function (obj) { return obj.scheduleWorkings; }, set: function (obj, value) { obj.scheduleWorkings = value; } }, metadata: _metadata }, _scheduleWorkings_initializers, _scheduleWorkings_extraInitializers);
        __esDecorate(null, null, _specializationAutorepairs_decorators, { kind: "field", name: "specializationAutorepairs", static: false, private: false, access: { has: function (obj) { return "specializationAutorepairs" in obj; }, get: function (obj) { return obj.specializationAutorepairs; }, set: function (obj, value) { obj.specializationAutorepairs = value; } }, metadata: _metadata }, _specializationAutorepairs_initializers, _specializationAutorepairs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Autorepair = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Autorepair = _classThis;
}();
exports.Autorepair = Autorepair;
