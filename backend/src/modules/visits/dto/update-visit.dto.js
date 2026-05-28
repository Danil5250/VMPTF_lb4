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
exports.UpdateVisitDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var SelectedServicesValidator_1 = require("../../shared/validators/SelectedServicesValidator");
var UpdateVisitDto = function () {
    var _a;
    var _car_brand_decorators;
    var _car_brand_initializers = [];
    var _car_brand_extraInitializers = [];
    var _car_model_decorators;
    var _car_model_initializers = [];
    var _car_model_extraInitializers = [];
    var _car_engineType_decorators;
    var _car_engineType_initializers = [];
    var _car_engineType_extraInitializers = [];
    var _car_year_decorators;
    var _car_year_initializers = [];
    var _car_year_extraInitializers = [];
    var _car_licensePlate_decorators;
    var _car_licensePlate_initializers = [];
    var _car_licensePlate_extraInitializers = [];
    var _car_vin_decorators;
    var _car_vin_initializers = [];
    var _car_vin_extraInitializers = [];
    var _client_name_decorators;
    var _client_name_initializers = [];
    var _client_name_extraInitializers = [];
    var _client_surname_decorators;
    var _client_surname_initializers = [];
    var _client_surname_extraInitializers = [];
    var _client_middlename_decorators;
    var _client_middlename_initializers = [];
    var _client_middlename_extraInitializers = [];
    var _client_email_decorators;
    var _client_email_initializers = [];
    var _client_email_extraInitializers = [];
    var _client_phone_decorators;
    var _client_phone_initializers = [];
    var _client_phone_extraInitializers = [];
    var _client_login_decorators;
    var _client_login_initializers = [];
    var _client_login_extraInitializers = [];
    var _client_password_decorators;
    var _client_password_initializers = [];
    var _client_password_extraInitializers = [];
    var _visit_selectedDate_decorators;
    var _visit_selectedDate_initializers = [];
    var _visit_selectedDate_extraInitializers = [];
    var _visit_selectedAlternativeDate_decorators;
    var _visit_selectedAlternativeDate_initializers = [];
    var _visit_selectedAlternativeDate_extraInitializers = [];
    var _visit_note_decorators;
    var _visit_note_initializers = [];
    var _visit_note_extraInitializers = [];
    var _visit_paymentWay_decorators;
    var _visit_paymentWay_initializers = [];
    var _visit_paymentWay_extraInitializers = [];
    var _visit_paymentStatus_decorators;
    var _visit_paymentStatus_initializers = [];
    var _visit_paymentStatus_extraInitializers = [];
    var _visit_isCompleted_decorators;
    var _visit_isCompleted_initializers = [];
    var _visit_isCompleted_extraInitializers = [];
    var _visit_carid_decorators;
    var _visit_carid_initializers = [];
    var _visit_carid_extraInitializers = [];
    var _visit_autorepairId_decorators;
    var _visit_autorepairId_initializers = [];
    var _visit_autorepairId_extraInitializers = [];
    var _visit_selectedServices_decorators;
    var _visit_selectedServices_initializers = [];
    var _visit_selectedServices_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVisitDto() {
                // @ValidateNested()
                // @Type(() => CreateCarDto)
                // carData: CreateCarDto;
                this.car_brand = __runInitializers(this, _car_brand_initializers, void 0);
                this.car_model = (__runInitializers(this, _car_brand_extraInitializers), __runInitializers(this, _car_model_initializers, void 0));
                this.car_engineType = (__runInitializers(this, _car_model_extraInitializers), __runInitializers(this, _car_engineType_initializers, void 0));
                this.car_year = (__runInitializers(this, _car_engineType_extraInitializers), __runInitializers(this, _car_year_initializers, void 0));
                this.car_licensePlate = (__runInitializers(this, _car_year_extraInitializers), __runInitializers(this, _car_licensePlate_initializers, void 0));
                this.car_vin = (__runInitializers(this, _car_licensePlate_extraInitializers), __runInitializers(this, _car_vin_initializers, void 0));
                // @ValidateNested()
                // @Type(() => CreateClientDto)
                // personalData: CreateClientDto;
                this.client_name = (__runInitializers(this, _car_vin_extraInitializers), __runInitializers(this, _client_name_initializers, void 0));
                this.client_surname = (__runInitializers(this, _client_name_extraInitializers), __runInitializers(this, _client_surname_initializers, void 0));
                this.client_middlename = (__runInitializers(this, _client_surname_extraInitializers), __runInitializers(this, _client_middlename_initializers, void 0));
                this.client_email = (__runInitializers(this, _client_middlename_extraInitializers), __runInitializers(this, _client_email_initializers, void 0));
                this.client_phone = (__runInitializers(this, _client_email_extraInitializers), __runInitializers(this, _client_phone_initializers, void 0));
                this.client_login = (__runInitializers(this, _client_phone_extraInitializers), __runInitializers(this, _client_login_initializers, void 0));
                this.client_password = (__runInitializers(this, _client_login_extraInitializers), __runInitializers(this, _client_password_initializers, void 0));
                this.visit_selectedDate = (__runInitializers(this, _client_password_extraInitializers), __runInitializers(this, _visit_selectedDate_initializers, void 0));
                this.visit_selectedAlternativeDate = (__runInitializers(this, _visit_selectedDate_extraInitializers), __runInitializers(this, _visit_selectedAlternativeDate_initializers, void 0));
                this.visit_note = (__runInitializers(this, _visit_selectedAlternativeDate_extraInitializers), __runInitializers(this, _visit_note_initializers, void 0));
                this.visit_paymentWay = (__runInitializers(this, _visit_note_extraInitializers), __runInitializers(this, _visit_paymentWay_initializers, void 0));
                this.visit_paymentStatus = (__runInitializers(this, _visit_paymentWay_extraInitializers), __runInitializers(this, _visit_paymentStatus_initializers, void 0));
                this.visit_isCompleted = (__runInitializers(this, _visit_paymentStatus_extraInitializers), __runInitializers(this, _visit_isCompleted_initializers, void 0));
                this.visit_carid = (__runInitializers(this, _visit_isCompleted_extraInitializers), __runInitializers(this, _visit_carid_initializers, void 0));
                this.visit_autorepairId = (__runInitializers(this, _visit_carid_extraInitializers), __runInitializers(this, _visit_autorepairId_initializers, void 0));
                this.visit_selectedServices = (__runInitializers(this, _visit_autorepairId_extraInitializers), __runInitializers(this, _visit_selectedServices_initializers, void 0));
                __runInitializers(this, _visit_selectedServices_extraInitializers);
            }
            return UpdateVisitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _car_brand_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _car_model_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _car_engineType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _car_year_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (value === '' || value == null ? undefined : Number(value));
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1886), (0, class_validator_1.Max)(new Date().getFullYear() + 1)];
            _car_licensePlate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _car_vin_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^[A-Za-z0-9]{6,17}$/, { message: 'VIN should be 6-17 alphanumeric' })];
            _client_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255), (0, class_validator_1.IsOptional)()];
            _client_surname_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255), (0, class_validator_1.IsOptional)()];
            _client_middlename_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(0, 255)];
            _client_email_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _client_phone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(0, 50)];
            _client_login_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(0, 100)];
            _client_password_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_selectedDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _visit_selectedAlternativeDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _visit_note_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_paymentWay_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_paymentStatus_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_isCompleted_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_carid_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_autorepairId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visit_selectedServices_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.Validate)(SelectedServicesValidator_1.SelectedServicesValidator)];
            __esDecorate(null, null, _car_brand_decorators, { kind: "field", name: "car_brand", static: false, private: false, access: { has: function (obj) { return "car_brand" in obj; }, get: function (obj) { return obj.car_brand; }, set: function (obj, value) { obj.car_brand = value; } }, metadata: _metadata }, _car_brand_initializers, _car_brand_extraInitializers);
            __esDecorate(null, null, _car_model_decorators, { kind: "field", name: "car_model", static: false, private: false, access: { has: function (obj) { return "car_model" in obj; }, get: function (obj) { return obj.car_model; }, set: function (obj, value) { obj.car_model = value; } }, metadata: _metadata }, _car_model_initializers, _car_model_extraInitializers);
            __esDecorate(null, null, _car_engineType_decorators, { kind: "field", name: "car_engineType", static: false, private: false, access: { has: function (obj) { return "car_engineType" in obj; }, get: function (obj) { return obj.car_engineType; }, set: function (obj, value) { obj.car_engineType = value; } }, metadata: _metadata }, _car_engineType_initializers, _car_engineType_extraInitializers);
            __esDecorate(null, null, _car_year_decorators, { kind: "field", name: "car_year", static: false, private: false, access: { has: function (obj) { return "car_year" in obj; }, get: function (obj) { return obj.car_year; }, set: function (obj, value) { obj.car_year = value; } }, metadata: _metadata }, _car_year_initializers, _car_year_extraInitializers);
            __esDecorate(null, null, _car_licensePlate_decorators, { kind: "field", name: "car_licensePlate", static: false, private: false, access: { has: function (obj) { return "car_licensePlate" in obj; }, get: function (obj) { return obj.car_licensePlate; }, set: function (obj, value) { obj.car_licensePlate = value; } }, metadata: _metadata }, _car_licensePlate_initializers, _car_licensePlate_extraInitializers);
            __esDecorate(null, null, _car_vin_decorators, { kind: "field", name: "car_vin", static: false, private: false, access: { has: function (obj) { return "car_vin" in obj; }, get: function (obj) { return obj.car_vin; }, set: function (obj, value) { obj.car_vin = value; } }, metadata: _metadata }, _car_vin_initializers, _car_vin_extraInitializers);
            __esDecorate(null, null, _client_name_decorators, { kind: "field", name: "client_name", static: false, private: false, access: { has: function (obj) { return "client_name" in obj; }, get: function (obj) { return obj.client_name; }, set: function (obj, value) { obj.client_name = value; } }, metadata: _metadata }, _client_name_initializers, _client_name_extraInitializers);
            __esDecorate(null, null, _client_surname_decorators, { kind: "field", name: "client_surname", static: false, private: false, access: { has: function (obj) { return "client_surname" in obj; }, get: function (obj) { return obj.client_surname; }, set: function (obj, value) { obj.client_surname = value; } }, metadata: _metadata }, _client_surname_initializers, _client_surname_extraInitializers);
            __esDecorate(null, null, _client_middlename_decorators, { kind: "field", name: "client_middlename", static: false, private: false, access: { has: function (obj) { return "client_middlename" in obj; }, get: function (obj) { return obj.client_middlename; }, set: function (obj, value) { obj.client_middlename = value; } }, metadata: _metadata }, _client_middlename_initializers, _client_middlename_extraInitializers);
            __esDecorate(null, null, _client_email_decorators, { kind: "field", name: "client_email", static: false, private: false, access: { has: function (obj) { return "client_email" in obj; }, get: function (obj) { return obj.client_email; }, set: function (obj, value) { obj.client_email = value; } }, metadata: _metadata }, _client_email_initializers, _client_email_extraInitializers);
            __esDecorate(null, null, _client_phone_decorators, { kind: "field", name: "client_phone", static: false, private: false, access: { has: function (obj) { return "client_phone" in obj; }, get: function (obj) { return obj.client_phone; }, set: function (obj, value) { obj.client_phone = value; } }, metadata: _metadata }, _client_phone_initializers, _client_phone_extraInitializers);
            __esDecorate(null, null, _client_login_decorators, { kind: "field", name: "client_login", static: false, private: false, access: { has: function (obj) { return "client_login" in obj; }, get: function (obj) { return obj.client_login; }, set: function (obj, value) { obj.client_login = value; } }, metadata: _metadata }, _client_login_initializers, _client_login_extraInitializers);
            __esDecorate(null, null, _client_password_decorators, { kind: "field", name: "client_password", static: false, private: false, access: { has: function (obj) { return "client_password" in obj; }, get: function (obj) { return obj.client_password; }, set: function (obj, value) { obj.client_password = value; } }, metadata: _metadata }, _client_password_initializers, _client_password_extraInitializers);
            __esDecorate(null, null, _visit_selectedDate_decorators, { kind: "field", name: "visit_selectedDate", static: false, private: false, access: { has: function (obj) { return "visit_selectedDate" in obj; }, get: function (obj) { return obj.visit_selectedDate; }, set: function (obj, value) { obj.visit_selectedDate = value; } }, metadata: _metadata }, _visit_selectedDate_initializers, _visit_selectedDate_extraInitializers);
            __esDecorate(null, null, _visit_selectedAlternativeDate_decorators, { kind: "field", name: "visit_selectedAlternativeDate", static: false, private: false, access: { has: function (obj) { return "visit_selectedAlternativeDate" in obj; }, get: function (obj) { return obj.visit_selectedAlternativeDate; }, set: function (obj, value) { obj.visit_selectedAlternativeDate = value; } }, metadata: _metadata }, _visit_selectedAlternativeDate_initializers, _visit_selectedAlternativeDate_extraInitializers);
            __esDecorate(null, null, _visit_note_decorators, { kind: "field", name: "visit_note", static: false, private: false, access: { has: function (obj) { return "visit_note" in obj; }, get: function (obj) { return obj.visit_note; }, set: function (obj, value) { obj.visit_note = value; } }, metadata: _metadata }, _visit_note_initializers, _visit_note_extraInitializers);
            __esDecorate(null, null, _visit_paymentWay_decorators, { kind: "field", name: "visit_paymentWay", static: false, private: false, access: { has: function (obj) { return "visit_paymentWay" in obj; }, get: function (obj) { return obj.visit_paymentWay; }, set: function (obj, value) { obj.visit_paymentWay = value; } }, metadata: _metadata }, _visit_paymentWay_initializers, _visit_paymentWay_extraInitializers);
            __esDecorate(null, null, _visit_paymentStatus_decorators, { kind: "field", name: "visit_paymentStatus", static: false, private: false, access: { has: function (obj) { return "visit_paymentStatus" in obj; }, get: function (obj) { return obj.visit_paymentStatus; }, set: function (obj, value) { obj.visit_paymentStatus = value; } }, metadata: _metadata }, _visit_paymentStatus_initializers, _visit_paymentStatus_extraInitializers);
            __esDecorate(null, null, _visit_isCompleted_decorators, { kind: "field", name: "visit_isCompleted", static: false, private: false, access: { has: function (obj) { return "visit_isCompleted" in obj; }, get: function (obj) { return obj.visit_isCompleted; }, set: function (obj, value) { obj.visit_isCompleted = value; } }, metadata: _metadata }, _visit_isCompleted_initializers, _visit_isCompleted_extraInitializers);
            __esDecorate(null, null, _visit_carid_decorators, { kind: "field", name: "visit_carid", static: false, private: false, access: { has: function (obj) { return "visit_carid" in obj; }, get: function (obj) { return obj.visit_carid; }, set: function (obj, value) { obj.visit_carid = value; } }, metadata: _metadata }, _visit_carid_initializers, _visit_carid_extraInitializers);
            __esDecorate(null, null, _visit_autorepairId_decorators, { kind: "field", name: "visit_autorepairId", static: false, private: false, access: { has: function (obj) { return "visit_autorepairId" in obj; }, get: function (obj) { return obj.visit_autorepairId; }, set: function (obj, value) { obj.visit_autorepairId = value; } }, metadata: _metadata }, _visit_autorepairId_initializers, _visit_autorepairId_extraInitializers);
            __esDecorate(null, null, _visit_selectedServices_decorators, { kind: "field", name: "visit_selectedServices", static: false, private: false, access: { has: function (obj) { return "visit_selectedServices" in obj; }, get: function (obj) { return obj.visit_selectedServices; }, set: function (obj, value) { obj.visit_selectedServices = value; } }, metadata: _metadata }, _visit_selectedServices_initializers, _visit_selectedServices_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVisitDto = UpdateVisitDto;
