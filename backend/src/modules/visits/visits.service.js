"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
var common_1 = require("@nestjs/common");
var visit_entity_1 = require("../entities/visit.entity");
var client_entity_1 = require("../entities/client.entity");
var car_entity_1 = require("../entities/car.entity");
var visit_service_entity_1 = require("../entities/visit-service.entity");
var autorepair_service_entity_1 = require("../entities/autorepair-service.entity");
var pdfkit_1 = require("pdfkit");
var path = require("node:path");
var VisitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VisitsService = _classThis = /** @class */ (function () {
        function VisitsService_1(visitRepo, clientRepo, carRepo, visitServiceRepo, autorepairServiceRepo, dataSource, mailService) {
            this.visitRepo = visitRepo;
            this.clientRepo = clientRepo;
            this.carRepo = carRepo;
            this.visitServiceRepo = visitServiceRepo;
            this.autorepairServiceRepo = autorepairServiceRepo;
            this.dataSource = dataSource;
            this.mailService = mailService;
        }
        VisitsService_1.prototype.createVisit = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    console.log('createVisit', user);
                    return [2 /*return*/, this.dataSource.transaction(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var isNecessaryCreateClient, found, isSameClientError, _i, found_1, c, dbClientId, newClient, savedClient, carId, existingCars, isSameCarError, _a, existingCars_1, c, dbCarId, newCar, savedCar, newVisit, savedVisit, visitId, _b, _c, service, vs, vs;
                            var _d, _e, _f, _g, _h, _j, _k, _l, _m;
                            return __generator(this, function (_o) {
                                switch (_o.label) {
                                    case 0:
                                        isNecessaryCreateClient = true;
                                        if (!(dto.client_email && dto.client_name)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, manager.find(client_entity_1.Client, {
                                                where: { email: dto.client_email, name: dto.client_name },
                                            })];
                                    case 1:
                                        found = _o.sent();
                                        if (found.length > 0) {
                                            isSameClientError = true;
                                            if (user === null || user === void 0 ? void 0 : user.id) {
                                                for (_i = 0, found_1 = found; _i < found_1.length; _i++) {
                                                    c = found_1[_i];
                                                    if (c.clientId == user.id) {
                                                        isNecessaryCreateClient = false;
                                                        isSameClientError = false;
                                                    }
                                                }
                                            }
                                            if (isSameClientError) {
                                                throw new common_1.ConflictException("Client with email \"".concat(dto.client_email, "\" and name \"").concat(dto.client_name, "\" already exists"));
                                            }
                                        }
                                        return [3 /*break*/, 3];
                                    case 2: throw new common_1.BadRequestException('Client email and name are required');
                                    case 3:
                                        if (!isNecessaryCreateClient) return [3 /*break*/, 5];
                                        newClient = manager.create(client_entity_1.Client, {
                                            name: dto.client_name || 'Unknown',
                                            surname: (_d = dto.client_surname) !== null && _d !== void 0 ? _d : null,
                                            middlename: (_e = dto.client_middlename) !== null && _e !== void 0 ? _e : null,
                                            email: (_f = dto.client_email) !== null && _f !== void 0 ? _f : null,
                                            phone: (_g = dto.client_phone) !== null && _g !== void 0 ? _g : null,
                                            login: (_h = dto.client_login) !== null && _h !== void 0 ? _h : null,
                                            password: (_j = dto.client_password) !== null && _j !== void 0 ? _j : null,
                                        });
                                        return [4 /*yield*/, manager.save(newClient)];
                                    case 4:
                                        savedClient = _o.sent();
                                        dbClientId = savedClient.clientId;
                                        return [3 /*break*/, 6];
                                    case 5:
                                        dbClientId = user.id;
                                        _o.label = 6;
                                    case 6:
                                        if (dto.car_year && dto.car_year > new Date().getFullYear()) {
                                            throw new common_1.BadRequestException('Рік автомобіля має бути у межах сучасного');
                                        }
                                        carId = null;
                                        if (!(dto.car_vin || dto.car_licensePlate)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, manager.find(car_entity_1.Car, {
                                                where: [{ licensePlate: dto.car_licensePlate }, { vin: dto.car_vin }],
                                            })];
                                    case 7:
                                        existingCars = _o.sent();
                                        if (existingCars.length > 0) {
                                            isSameCarError = true;
                                            if (user === null || user === void 0 ? void 0 : user.id) {
                                                for (_a = 0, existingCars_1 = existingCars; _a < existingCars_1.length; _a++) {
                                                    c = existingCars_1[_a];
                                                    if (c.clientId == user.id) {
                                                        carId = c.carId;
                                                        isSameCarError = false;
                                                    }
                                                }
                                            }
                                            if (isSameCarError) {
                                                throw new common_1.ConflictException("Car with license_plate \"".concat(dto.car_licensePlate, "\" or vin \"").concat(dto.car_vin, "\" already exists"));
                                            }
                                        }
                                        return [3 /*break*/, 9];
                                    case 8: throw new common_1.BadRequestException('Car vin and license plate are required');
                                    case 9:
                                        if (!!carId) return [3 /*break*/, 11];
                                        newCar = manager.create(car_entity_1.Car, {
                                            brand: dto.car_brand,
                                            model: dto.car_model,
                                            engineType: (_k = dto.car_engineType) !== null && _k !== void 0 ? _k : null,
                                            year: (_l = dto.car_year) !== null && _l !== void 0 ? _l : null,
                                            licensePlate: dto.car_licensePlate,
                                            vin: dto.car_vin,
                                            clientId: dbClientId,
                                        });
                                        return [4 /*yield*/, manager.save(newCar)];
                                    case 10:
                                        savedCar = _o.sent();
                                        dbCarId = savedCar.carId;
                                        return [3 /*break*/, 12];
                                    case 11:
                                        dbCarId = carId;
                                        _o.label = 12;
                                    case 12:
                                        if (!dto.visit_selectedDate && !dto.is_urgent) {
                                            throw new common_1.BadRequestException('Date of visit cannot be empty');
                                        }
                                        if (!dto.is_urgent && new Date(dto.visit_selectedDate).getTime() < new Date().getTime()) {
                                            throw new common_1.BadRequestException('Дата візиту має бути від сьогодні');
                                        }
                                        newVisit = manager.create(visit_entity_1.Visit, {
                                            dateTime: dto.visit_selectedDate ? new Date(dto.visit_selectedDate) : undefined,
                                            alternativeDateTime: dto.visit_selectedAlternativeDate
                                                ? new Date(dto.visit_selectedAlternativeDate)
                                                : undefined,
                                            note: (_m = dto.visit_note) !== null && _m !== void 0 ? _m : undefined,
                                            paymentWay: 'готівка',
                                            paymentStatus: 'не оплачено',
                                            isCompleted: dto.visit_isCompleted !== undefined ? String(dto.visit_isCompleted) === 'true' : false,
                                            carId: dbCarId,
                                            autorepairId: dto.visit_autorepairId ? Number(dto.visit_autorepairId) : undefined,
                                            isUrgent: dto.is_urgent !== undefined ? String(dto.is_urgent) === 'true' : false,
                                        });
                                        return [4 /*yield*/, manager.save(newVisit)];
                                    case 13:
                                        savedVisit = _o.sent();
                                        visitId = savedVisit.visitId;
                                        if (!(dto.visit_selectedServices && Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0)) return [3 /*break*/, 18];
                                        _b = 0, _c = dto.visit_selectedServices;
                                        _o.label = 14;
                                    case 14:
                                        if (!(_b < _c.length)) return [3 /*break*/, 17];
                                        service = _c[_b];
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            problemDescription: null,
                                            visitId: visitId,
                                            autorepairServiceId: typeof service === 'number' ? service : null,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 15:
                                        _o.sent();
                                        _o.label = 16;
                                    case 16:
                                        _b++;
                                        return [3 /*break*/, 14];
                                    case 17: return [3 /*break*/, 20];
                                    case 18:
                                        if (!(typeof dto.visit_selectedServices === 'string')) return [3 /*break*/, 20];
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            problemDescription: dto.visit_selectedServices,
                                            visitId: visitId,
                                            autorepairServiceId: null,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 19:
                                        _o.sent();
                                        _o.label = 20;
                                    case 20: return [2 /*return*/, { visitId: visitId, clientId: dbClientId, carId: dbCarId }];
                                }
                            });
                        }); }).catch(function (err) {
                            if (err.code === '23505') {
                                var detail = err.detail || '';
                                if (detail.includes('clients_name_email') || detail.includes('uq_client_name_email')) {
                                    throw new common_1.ConflictException("Client with email \"".concat(dto.client_email, "\" and name \"").concat(dto.client_name, "\" already exists"));
                                }
                                else if (detail.includes('cars_license_plate') || detail.includes('cars_vin')) {
                                    throw new common_1.BadRequestException("Car with license_plate \"".concat(dto.car_licensePlate, "\" or vin \"").concat(dto.car_vin, "\" already exists"));
                                }
                            }
                            if (err instanceof common_1.BadRequestException ||
                                err instanceof common_1.ConflictException)
                                throw err;
                            throw new common_1.InternalServerErrorException(err.message || 'Database error during visit creation');
                        })];
                });
            });
        };
        VisitsService_1.prototype.updateVisit = function (visitId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.dataSource.transaction(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var existingVisit, car, clientId, dbClientId, dbCarId, conflictClient, conflictCar, _i, _a, service, vs, vs;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, manager
                                            .createQueryBuilder(visit_entity_1.Visit, 'v')
                                            .innerJoin('v.car', 'c')
                                            .addSelect('c.clientId', 'clientId')
                                            .where('v.visitId = :visitId', { visitId: visitId })
                                            .getOne()];
                                    case 1:
                                        existingVisit = _c.sent();
                                        if (!existingVisit) {
                                            throw new common_1.BadRequestException("Visit with ID ".concat(visitId, " not found"));
                                        }
                                        return [4 /*yield*/, manager.findOne(car_entity_1.Car, { where: { carId: existingVisit.carId } })];
                                    case 2:
                                        car = _c.sent();
                                        clientId = car.clientId;
                                        if ((user === null || user === void 0 ? void 0 : user.id) && clientId !== user.id) {
                                            throw new common_1.ForbiddenException('You can only update your own visits');
                                        }
                                        dbClientId = clientId;
                                        dbCarId = Number((_b = dto.visit_carid) !== null && _b !== void 0 ? _b : existingVisit.carId);
                                        if (!(dto.client_email || dto.client_name)) return [3 /*break*/, 6];
                                        if (!(dto.client_email && dto.client_name)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, manager.findOne(client_entity_1.Client, {
                                                where: { email: dto.client_email, name: dto.client_name },
                                            })];
                                    case 3:
                                        conflictClient = _c.sent();
                                        if (conflictClient && conflictClient.clientId !== dbClientId) {
                                            throw new common_1.ConflictException("Another client with email \"".concat(dto.client_email, "\" and name \"").concat(dto.client_name, "\" already exists"));
                                        }
                                        _c.label = 4;
                                    case 4: return [4 /*yield*/, manager.update(client_entity_1.Client, { clientId: dbClientId }, __assign(__assign(__assign(__assign(__assign(__assign({}, (dto.client_name && { name: dto.client_name })), (dto.client_surname !== undefined && { surname: dto.client_surname })), (dto.client_middlename !== undefined && { middlename: dto.client_middlename })), (dto.client_email && { email: dto.client_email })), (dto.client_phone !== undefined && { phone: dto.client_phone })), (dto.client_login !== undefined && { login: dto.client_login })))];
                                    case 5:
                                        _c.sent();
                                        _c.label = 6;
                                    case 6:
                                        if (!(dto.car_vin || dto.car_licensePlate)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, manager.findOne(car_entity_1.Car, {
                                                where: [{ licensePlate: dto.car_licensePlate }, { vin: dto.car_vin }],
                                            })];
                                    case 7:
                                        conflictCar = _c.sent();
                                        if (conflictCar && conflictCar.carId !== dbCarId) {
                                            if ((user === null || user === void 0 ? void 0 : user.id) && conflictCar.clientId !== user.id) {
                                                throw new common_1.ConflictException("Another car with license_plate \"".concat(dto.car_licensePlate, "\" or vin \"").concat(dto.car_vin, "\" already exists"));
                                            }
                                        }
                                        _c.label = 8;
                                    case 8: return [4 /*yield*/, manager.update(visit_entity_1.Visit, { visitId: visitId }, __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (dto.visit_selectedDate && { dateTime: new Date(dto.visit_selectedDate) })), { alternativeDateTime: dto.visit_selectedAlternativeDate
                                                ? new Date(dto.visit_selectedAlternativeDate)
                                                : undefined }), (dto.visit_note !== undefined && { note: dto.visit_note })), (dto.visit_paymentWay && { paymentWay: dto.visit_paymentWay })), (dto.visit_paymentStatus && { paymentStatus: dto.visit_paymentStatus })), (dto.visit_isCompleted !== undefined && { isCompleted: String(dto.visit_isCompleted) === 'true' })), { carId: dbCarId }), (dto.visit_autorepairId && { autorepairId: Number(dto.visit_autorepairId) })))];
                                    case 9:
                                        _c.sent();
                                        if (!(dto.visit_selectedServices !== undefined)) return [3 /*break*/, 17];
                                        return [4 /*yield*/, manager.delete(visit_service_entity_1.VisitService, { visitId: visitId })];
                                    case 10:
                                        _c.sent();
                                        if (!(Array.isArray(dto.visit_selectedServices) && dto.visit_selectedServices.length > 0)) return [3 /*break*/, 15];
                                        _i = 0, _a = dto.visit_selectedServices;
                                        _c.label = 11;
                                    case 11:
                                        if (!(_i < _a.length)) return [3 /*break*/, 14];
                                        service = _a[_i];
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            problemDescription: null,
                                            visitId: visitId,
                                            autorepairServiceId: typeof service === 'number' ? service : null,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 12:
                                        _c.sent();
                                        _c.label = 13;
                                    case 13:
                                        _i++;
                                        return [3 /*break*/, 11];
                                    case 14: return [3 /*break*/, 17];
                                    case 15:
                                        if (!(typeof dto.visit_selectedServices === 'string')) return [3 /*break*/, 17];
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            problemDescription: dto.visit_selectedServices,
                                            visitId: visitId,
                                            autorepairServiceId: null,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 16:
                                        _c.sent();
                                        _c.label = 17;
                                    case 17: return [2 /*return*/, { visitId: visitId, clientId: dbClientId, carId: dbCarId }];
                                }
                            });
                        }); }).catch(function (err) {
                            if (err.code === '23505') {
                                var detail = err.detail || '';
                                if (detail.includes('uq_client_name_email')) {
                                    throw new common_1.ConflictException("Client with email \"".concat(dto.client_email, "\" and name \"").concat(dto.client_name, "\" already exists"));
                                }
                                else if (detail.includes('cars_license_plate')) {
                                    throw new common_1.ConflictException("Car with license_plate \"".concat(dto.car_licensePlate, "\" already exists"));
                                }
                                else if (detail.includes('cars_vin')) {
                                    throw new common_1.ConflictException("Car with vin \"".concat(dto.car_vin, "\" already exists"));
                                }
                            }
                            if (err instanceof common_1.BadRequestException ||
                                err instanceof common_1.ConflictException ||
                                err instanceof common_1.NotFoundException ||
                                err instanceof common_1.ForbiddenException)
                                throw err;
                            throw new common_1.InternalServerErrorException(err.message || 'Database error during visit update');
                        })];
                });
            });
        };
        VisitsService_1.prototype.getVisitReport = function (visitId, clientId, carId) {
            return __awaiter(this, void 0, void 0, function () {
                var visit_1, client_1, car_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.visitRepo.findOneBy({ visitId: visitId })];
                        case 1:
                            visit_1 = _a.sent();
                            return [4 /*yield*/, this.clientRepo.findOneBy({ clientId: clientId })];
                        case 2:
                            client_1 = _a.sent();
                            return [4 /*yield*/, this.carRepo.findOneBy({ carId: carId })];
                        case 3:
                            car_1 = _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var _a, _b;
                                    try {
                                        var doc = new pdfkit_1.default();
                                        var fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts', 'DejaVuSans.ttf');
                                        doc.registerFont('custom', fontPath);
                                        doc.font('custom');
                                        var chunks_1 = [];
                                        doc.on('data', function (chunk) { return chunks_1.push(chunk); });
                                        doc.on('end', function () { return resolve(Buffer.concat(chunks_1)); });
                                        doc.on('error', reject);
                                        doc.fontSize(24).fillColor('#1e293b').text('Підтвердження візиту', { align: 'center' }).moveDown(1.5);
                                        doc.fontSize(16).fillColor('#0f172a').text('Інформація про клієнта', { underline: true });
                                        doc.moveDown(0.5);
                                        doc.fontSize(13).fillColor('#334155');
                                        doc.text("\u041F\u0406\u0411: ".concat((client_1 === null || client_1 === void 0 ? void 0 : client_1.name) || '', " ").concat((client_1 === null || client_1 === void 0 ? void 0 : client_1.surname) || ''));
                                        doc.text("Email: ".concat((client_1 === null || client_1 === void 0 ? void 0 : client_1.email) || '—'));
                                        doc.text("\u0422\u0435\u043B\u0435\u0444\u043E\u043D: ".concat((client_1 === null || client_1 === void 0 ? void 0 : client_1.phone) || '—'));
                                        doc.moveDown(1);
                                        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cbd5e1').moveDown(1);
                                        doc.fontSize(16).fillColor('#0f172a').text('Деталі візиту', { underline: true });
                                        doc.moveDown(0.5);
                                        doc.fontSize(13).fillColor('#334155');
                                        doc.text("\u0414\u0430\u0442\u0430 \u0432\u0456\u0437\u0438\u0442\u0443: ".concat(((_a = visit_1 === null || visit_1 === void 0 ? void 0 : visit_1.dateTime) === null || _a === void 0 ? void 0 : _a.toLocaleString()) || '—'));
                                        doc.text("\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u0430 \u0434\u0430\u0442\u0430: ".concat(((_b = visit_1 === null || visit_1 === void 0 ? void 0 : visit_1.alternativeDateTime) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || '—'));
                                        doc.text("\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430: ".concat((visit_1 === null || visit_1 === void 0 ? void 0 : visit_1.note) || '—'));
                                        doc.text("\u0421\u043F\u043E\u0441\u0456\u0431 \u043E\u043F\u043B\u0430\u0442\u0438: ".concat((visit_1 === null || visit_1 === void 0 ? void 0 : visit_1.paymentWay) || '—'));
                                        doc.text("\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u043F\u043B\u0430\u0442\u0438: ".concat((visit_1 === null || visit_1 === void 0 ? void 0 : visit_1.paymentStatus) || '—'));
                                        doc.moveDown(1);
                                        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cbd5e1').moveDown(1);
                                        doc.fontSize(16).fillColor('#0f172a').text('Автомобіль', { underline: true });
                                        doc.moveDown(0.5);
                                        doc.fontSize(13).fillColor('#334155');
                                        doc.text("\u041C\u0430\u0440\u043A\u0430: ".concat(car_1 === null || car_1 === void 0 ? void 0 : car_1.brand));
                                        doc.text("\u041C\u043E\u0434\u0435\u043B\u044C: ".concat(car_1 === null || car_1 === void 0 ? void 0 : car_1.model));
                                        doc.text("\u0420\u0456\u043A \u0432\u0438\u043F\u0443\u0441\u043A\u0443: ".concat(car_1 === null || car_1 === void 0 ? void 0 : car_1.year));
                                        doc.text("\u0414\u0435\u0440\u0436. \u043D\u043E\u043C\u0435\u0440: ".concat(car_1 === null || car_1 === void 0 ? void 0 : car_1.licensePlate));
                                        doc.text("VIN: ".concat(car_1 === null || car_1 === void 0 ? void 0 : car_1.vin));
                                        doc.moveDown(1);
                                        doc.fontSize(12).fillColor('#64748b').text("\u0414\u0430\u0442\u0430 \u0444\u043E\u0440\u043C\u0443\u0432\u0430\u043D\u043D\u044F \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430: ".concat(new Date().toLocaleString()), { align: 'right' });
                                        doc.end();
                                    }
                                    catch (err) {
                                        reject(err);
                                    }
                                })];
                        case 4:
                            error_1 = _a.sent();
                            console.error("Error in getVisitReport: ", error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        VisitsService_1.prototype.getVisitAutorepirs = function (visitId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dataSource.query("\n            SELECT ars.service_id\n            FROM Visit_Services vs\n            JOIN Autorepair_Services ars ON vs.autorepair_service_id = ars.autorepair_service_id\n            WHERE vs.visit_id = $1\n        ", [visitId])];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        VisitsService_1.prototype.getVisitAutorepairServicesById = function (visitId) {
            return __awaiter(this, void 0, void 0, function () {
                var visit, autorepairQuery, autorepair, selectedServices, problemDescriptionQuery, problemDescription, allServices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.visitRepo.findOneBy({ visitId: visitId })];
                        case 1:
                            visit = _a.sent();
                            if (!visit)
                                throw new common_1.NotFoundException('Visit not found');
                            return [4 /*yield*/, this.dataSource.query("\n            SELECT * FROM Autorepairs WHERE autorepair_id = $1\n        ", [visit.autorepairId])];
                        case 2:
                            autorepairQuery = _a.sent();
                            autorepair = autorepairQuery[0];
                            return [4 /*yield*/, this.dataSource.query("\n            SELECT vs.visit_service_id, s.service_id, s.name, s.description, ars.autorepair_service_id\n            FROM Visit_Services vs\n            JOIN Autorepair_Services ars ON ars.autorepair_service_id = vs.autorepair_service_id\n            JOIN Services s ON s.service_id = ars.service_id\n            WHERE vs.visit_id = $1\n        ", [visitId])];
                        case 3:
                            selectedServices = _a.sent();
                            return [4 /*yield*/, this.dataSource.query("\n            SELECT problem_description FROM visit_services WHERE visit_id = $1\n        ", [visitId])];
                        case 4:
                            problemDescriptionQuery = _a.sent();
                            problemDescription = problemDescriptionQuery[0];
                            return [4 /*yield*/, this.dataSource.query("\n            SELECT ars.autorepair_service_id, s.name\n            FROM Autorepair_Services ars\n            JOIN Services s ON s.service_id = ars.service_id\n            WHERE ars.autorepair_id = $1\n            ORDER BY s.name\n        ", [visit.autorepairId])];
                        case 5:
                            allServices = _a.sent();
                            return [2 /*return*/, { visit: visit, autorepair: autorepair, selectedServices: selectedServices, problemDescription: problemDescription, allServices: allServices }];
                    }
                });
            });
        };
        VisitsService_1.prototype.updateVisitByIdSetCompleted = function (visitId, is_completed) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, email, date, formattedDate, servicesHtml, html;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.visitRepo.update({ visitId: visitId }, { isCompleted: is_completed })];
                        case 1:
                            _d.sent();
                            if (!is_completed) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.dataSource.query("\n                SELECT\n                    v.visit_id, v.date_time, v.is_urgent,\n                    c.brand, c.model, c.engine_type, c.year, c.license_plate, c.vin,\n                    cl.name AS client_name, cl.surname AS client_surname, cl.email AS client_email,\n                    ar.name AS autorepair_name, ar.adress AS autorepair_address, ar.phone AS autorepair_phone,\n                    s.name AS service_name, ars.service_price, ars.duration\n                FROM clients cl\n                INNER JOIN cars c ON c.client_id = cl.client_id\n                INNER JOIN visits v ON v.car_id = c.car_id\n                LEFT JOIN visit_services vs ON v.visit_id = vs.visit_id\n                LEFT JOIN autorepairs ar ON v.autorepair_id = ar.autorepair_id\n                LEFT JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id\n                LEFT JOIN services s ON ars.service_id = s.service_id\n                WHERE v.visit_id = $1\n            ", [visitId])];
                        case 2:
                            rows = _d.sent();
                            email = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.client_email;
                            if (!email)
                                throw new common_1.BadRequestException('Email клієнта не знайдено');
                            if (!rows.length)
                                throw new common_1.BadRequestException('Візит з клієнтом не знайдено');
                            date = new Date((_b = rows[0].date_time) !== null && _b !== void 0 ? _b : new Date());
                            formattedDate = this._formatDate(date);
                            servicesHtml = rows
                                .filter(function (r) { return r.service_name; })
                                .map(function (r) { return "<li>".concat(r.service_name, " \u2014 ").concat(r.service_price, " \u0433\u0440\u043D \u2014 ").concat(r.duration, " \u0445\u0432</li>"); })
                                .join('');
                            html = "\n                <h2>\u0412\u0430\u0448 \u0432\u0456\u0437\u0438\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u2705</h2>\n                <p>\u0414\u044F\u043A\u0443\u0454\u043C\u043E, \u0449\u043E \u0437\u0432\u0435\u0440\u043D\u0443\u043B\u0438\u0441\u044F \u0434\u043E \u043D\u0430\u0448\u043E\u0433\u043E \u0430\u0432\u0442\u043E\u0441\u0435\u0440\u0432\u0456\u0441\u0443.</p>\n                <p>\u041D\u043E\u043C\u0435\u0440 \u0432\u0456\u0437\u0438\u0442\u0443: <b>".concat(visitId, "</b></p>\n                <p><b>\u0414\u0430\u0442\u0430:</b> ").concat(formattedDate, "</p>\n                <p><b>\u0422\u0435\u0440\u043C\u0456\u043D\u043E\u0432\u0438\u0439:</b> ").concat(rows[0].is_urgent ? 'Так' : 'Ні', "</p>\n                <hr/>\n                <h3>\uD83D\uDC64 \u041A\u043B\u0456\u0454\u043D\u0442</h3>\n                <p>").concat(rows[0].client_name, " ").concat((_c = rows[0].client_surname) !== null && _c !== void 0 ? _c : '', "</p>\n                <h3>\uD83D\uDE97 \u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u044C</h3>\n                <ul>\n                    <li>\u041C\u0430\u0440\u043A\u0430: ").concat(rows[0].brand, "</li>\n                    <li>\u041C\u043E\u0434\u0435\u043B\u044C: ").concat(rows[0].model, "</li>\n                    <li>\u0414\u0432\u0438\u0433\u0443\u043D: ").concat(rows[0].engine_type, "</li>\n                    <li>\u0420\u0456\u043A: ").concat(rows[0].year, "</li>\n                    <li>\u041D\u043E\u043C\u0435\u0440: ").concat(rows[0].license_plate, "</li>\n                    <li>VIN: ").concat(rows[0].vin, "</li>\n                </ul>\n                <h3>\uD83C\uDFE2 \u0410\u0432\u0442\u043E\u043C\u0430\u0439\u0441\u0442\u0435\u0440\u043D\u044F</h3>\n                <ul>\n                    <li>\u041D\u0430\u0437\u0432\u0430: ").concat(rows[0].autorepair_name, "</li>\n                    <li>\u0410\u0434\u0440\u0435\u0441\u0430: ").concat(rows[0].autorepair_address, "</li>\n                    <li>\u0422\u0435\u043B\u0435\u0444\u043E\u043D: ").concat(rows[0].autorepair_phone, "</li>\n                </ul>\n                <h3>\uD83D\uDEE0\uFE0F \u041E\u0431\u0440\u0430\u043D\u0456 \u043F\u043E\u0441\u043B\u0443\u0433\u0438</h3>\n                <ul>").concat(servicesHtml || '<li>Послуги не вибрані</li>', "</ul>\n                <p>\u041D\u043E\u043C\u0435\u0440 \u0432\u0456\u0437\u0438\u0442\u0443: <b>").concat(visitId, "</b></p>\n            ");
                            return [4 /*yield*/, this.mailService.sendMail(email, 'Ваш візит успішно завершено ✅', 'Дякуємо, що скористались нашим сервісом!', html)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VisitsService_1.prototype.updateVisitDate = function (visitId, date_time) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, clientEmail, date, formattedDate, servicesHtml, html;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.visitRepo.update({ visitId: visitId }, { dateTime: date_time })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.dataSource.query("\n            SELECT\n                v.visit_id, v.date_time, v.is_urgent,\n                c.brand, c.model, c.engine_type, c.year, c.license_plate, c.vin,\n                cl.name AS client_name, cl.surname AS client_surname, cl.email AS client_email,\n                ar.name AS autorepair_name, ar.adress AS autorepair_address, ar.phone AS autorepair_phone,\n                s.name AS service_name, ars.service_price, ars.duration\n            FROM visits v\n            INNER JOIN cars c ON v.car_id = c.car_id\n            INNER JOIN clients cl ON c.client_id = cl.client_id\n            LEFT JOIN autorepairs ar ON v.autorepair_id = ar.autorepair_id\n            LEFT JOIN visit_services vs ON v.visit_id = vs.visit_id\n            LEFT JOIN autorepair_services ars ON vs.autorepair_service_id = ars.autorepair_service_id\n            LEFT JOIN services s ON ars.service_id = s.service_id\n            WHERE v.visit_id = $1\n        ", [visitId])];
                        case 2:
                            rows = _b.sent();
                            if (!rows.length)
                                throw new common_1.BadRequestException('Візит не знайдено');
                            clientEmail = rows[0].client_email;
                            date = new Date(date_time);
                            formattedDate = this._formatDate(date);
                            servicesHtml = rows
                                .filter(function (r) { return r.service_name; })
                                .map(function (r) { return "<li>".concat(r.service_name, " \u2014 ").concat(r.service_price, " \u0433\u0440\u043D \u2014 ").concat(r.duration, " \u0445\u0432</li>"); })
                                .join('');
                            html = "\n            <h2>\u2705 \u0412\u0430\u0448 \u0432\u0456\u0437\u0438\u0442 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043E</h2>\n            <p><b>\u0414\u0430\u0442\u0430:</b> ".concat(formattedDate, "</p>\n            <p><b>\u0422\u0435\u0440\u043C\u0456\u043D\u043E\u0432\u0438\u0439:</b> ").concat(rows[0].is_urgent ? 'Так' : 'Ні', "</p>\n            <hr/>\n            <h3>\uD83D\uDC64 \u041A\u043B\u0456\u0454\u043D\u0442</h3>\n            <p>").concat(rows[0].client_name, " ").concat((_a = rows[0].client_surname) !== null && _a !== void 0 ? _a : '', "</p>\n            <h3>\uD83D\uDE97 \u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u044C</h3>\n            <ul>\n                <li>\u041C\u0430\u0440\u043A\u0430: ").concat(rows[0].brand, "</li>\n                <li>\u041C\u043E\u0434\u0435\u043B\u044C: ").concat(rows[0].model, "</li>\n                <li>\u0414\u0432\u0438\u0433\u0443\u043D: ").concat(rows[0].engine_type, "</li>\n                <li>\u0420\u0456\u043A: ").concat(rows[0].year, "</li>\n                <li>\u041D\u043E\u043C\u0435\u0440: ").concat(rows[0].license_plate, "</li>\n                <li>VIN: ").concat(rows[0].vin, "</li>\n            </ul>\n            <h3>\uD83C\uDFE2 \u0410\u0432\u0442\u043E\u043C\u0430\u0439\u0441\u0442\u0435\u0440\u043D\u044F</h3>\n            <ul>\n                <li>\u041D\u0430\u0437\u0432\u0430: ").concat(rows[0].autorepair_name, "</li>\n                <li>\u0410\u0434\u0440\u0435\u0441\u0430: ").concat(rows[0].autorepair_address, "</li>\n                <li>\u0422\u0435\u043B\u0435\u0444\u043E\u043D: ").concat(rows[0].autorepair_phone, "</li>\n            </ul>\n            <h3>\uD83D\uDEE0\uFE0F \u041E\u0431\u0440\u0430\u043D\u0456 \u043F\u043E\u0441\u043B\u0443\u0433\u0438</h3>\n            <ul>").concat(servicesHtml || '<li>Послуги не вибрані</li>', "</ul>\n            <p>\u041D\u043E\u043C\u0435\u0440 \u0432\u0456\u0437\u0438\u0442\u0443: <b>").concat(visitId, "</b></p>\n            <p>\u23F3 \u041E\u0447\u0456\u043A\u0443\u0454\u043C \u043F\u0440\u0438\u0431\u0443\u0442\u0442\u044F \u0432 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441</p>\n        ");
                            return [4 /*yield*/, this.mailService.sendMail(clientEmail, "\u2705 \u0412\u0430\u0448 \u0432\u0456\u0437\u0438\u0442 \u2116".concat(visitId, " \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043E"), 'Деталі вашого візиту', html)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VisitsService_1.prototype.findAllVisits = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.dataSource.query("\n                SELECT v.*,\n                    COALESCE(json_agg(ars.service_id) FILTER (WHERE ars.service_id IS NOT NULL), '[]') AS services_ids\n                FROM visits AS v\n                LEFT JOIN visit_services AS vs ON v.visit_id = vs.visit_id\n                LEFT JOIN Autorepair_Services AS ars ON vs.autorepair_service_id = ars.autorepair_service_id\n                GROUP BY v.visit_id\n                ORDER BY v.visit_id\n            ")];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result !== null && result !== void 0 ? result : []];
                        case 2:
                            error_2 = _a.sent();
                            console.log(error_2);
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        VisitsService_1.prototype.findAllVisitsClients = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dataSource.query("\n            SELECT v.visit_id, date_time, alternative_date_time,\n                   note, payment_way, payment_status, is_completed, is_urgent,\n                   cl.name, surname, middlename, email, phone\n            FROM visits AS v\n            JOIN cars AS c ON v.car_id = c.car_id\n            JOIN clients cl ON cl.client_id = c.client_id\n        ")];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        VisitsService_1.prototype.selectVisitsClientsServices = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dataSource.query("\n            SELECT sv.visit_service_id, c.client_id, cl.name AS client_name,\n                   cl.surname AS client_surname, cl.middlename AS client_middlename,\n                   cl.email, cl.phone, v.visit_id, v.date_time, v.alternative_date_time,\n                   v.note AS visit_note, v.payment_way, v.payment_status,\n                   sv.autorepair_service_id, ser.name AS service_name, ser.description,\n                   s.service_price, s.garantie_term, s.duration\n            FROM visit_services AS sv\n            JOIN visits AS v ON sv.visit_id = v.visit_id\n            JOIN autorepair_services AS s ON sv.autorepair_service_id = s.autorepair_service_id\n            JOIN services AS ser ON s.service_id = ser.service_id\n            JOIN cars AS c ON v.car_id = c.car_id\n            JOIN clients cl ON cl.client_id = c.client_id\n            ORDER BY c.client_id\n        ")];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        VisitsService_1.prototype.deleteVisit = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.visitRepo.delete({ visitId: id })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VisitsService_1.prototype.createVisitByAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    console.log('createVisitByAdmin', dto);
                    return [2 /*return*/, this.dataSource.transaction(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var newVisit, savedVisit, visitId, _i, _a, serviceId, arsEntity, vs;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        newVisit = manager.create(visit_entity_1.Visit, {
                                            dateTime: dto.date_time,
                                            note: dto.note || null,
                                            paymentWay: dto.payment_way,
                                            paymentStatus: dto.payment_status,
                                            isCompleted: dto.is_completed,
                                            isUrgent: dto.is_urgent || false,
                                            carId: dto.car_id,
                                            autorepairId: dto.autorepair_id || null,
                                            alternativeDateTime: dto.alternative_date_time,
                                        });
                                        return [4 /*yield*/, manager.save(newVisit)];
                                    case 1:
                                        savedVisit = _b.sent();
                                        visitId = savedVisit.visitId;
                                        if (!(dto.services_ids && dto.services_ids.length > 0)) return [3 /*break*/, 6];
                                        _i = 0, _a = dto.services_ids;
                                        _b.label = 2;
                                    case 2:
                                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                                        serviceId = _a[_i];
                                        if (!dto.autorepair_id)
                                            throw new common_1.BadRequestException('Autorepair is required to add services');
                                        return [4 /*yield*/, manager.findOne(autorepair_service_entity_1.AutorepairService, {
                                                where: { autorepairId: dto.autorepair_id, serviceId: serviceId },
                                            })];
                                    case 3:
                                        arsEntity = _b.sent();
                                        if (!arsEntity) {
                                            // Cannot insert without price/duration (NOT NULL constraints), skip
                                            return [3 /*break*/, 5];
                                        }
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            visitId: visitId,
                                            autorepairServiceId: arsEntity.autorepairServiceId,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 4:
                                        _b.sent();
                                        _b.label = 5;
                                    case 5:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 6: return [2 /*return*/, { message: 'Visit created successfully' }];
                                }
                            });
                        }); })];
                });
            });
        };
        VisitsService_1.prototype.updateVisitByAdmin = function (visitId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.dataSource.transaction(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, serviceId, arsEntity, vs;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, manager.update(visit_entity_1.Visit, { visitId: visitId }, {
                                            dateTime: dto.date_time,
                                            note: dto.note || null,
                                            isUrgent: dto.is_urgent || false,
                                            carId: dto.car_id,
                                            autorepairId: dto.autorepair_id,
                                            alternativeDateTime: dto.alternative_date_time,
                                            paymentWay: dto.payment_way,
                                            paymentStatus: dto.payment_status,
                                            isCompleted: dto.is_completed,
                                        })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, manager.delete(visit_service_entity_1.VisitService, { visitId: visitId })];
                                    case 2:
                                        _b.sent();
                                        if (!(dto.services_ids && dto.services_ids.length > 0)) return [3 /*break*/, 7];
                                        _i = 0, _a = dto.services_ids;
                                        _b.label = 3;
                                    case 3:
                                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                                        serviceId = _a[_i];
                                        if (!dto.autorepair_id)
                                            throw new common_1.BadRequestException('Autorepair is required to add services');
                                        return [4 /*yield*/, manager.findOne(autorepair_service_entity_1.AutorepairService, {
                                                where: { autorepairId: dto.autorepair_id, serviceId: serviceId },
                                            })];
                                    case 4:
                                        arsEntity = _b.sent();
                                        if (!arsEntity)
                                            return [3 /*break*/, 6];
                                        vs = manager.create(visit_service_entity_1.VisitService, {
                                            visitId: visitId,
                                            autorepairServiceId: arsEntity.autorepairServiceId,
                                        });
                                        return [4 /*yield*/, manager.save(vs)];
                                    case 5:
                                        _b.sent();
                                        _b.label = 6;
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 7: return [2 /*return*/, { message: 'Visit updated successfully' }];
                                }
                            });
                        }); })];
                });
            });
        };
        VisitsService_1.prototype._formatDate = function (date) {
            return (date.getFullYear() +
                '-' +
                String(date.getMonth() + 1).padStart(2, '0') +
                '-' +
                String(date.getDate()).padStart(2, '0') +
                ' ' +
                String(date.getHours()).padStart(2, '0') +
                ':' +
                String(date.getMinutes()).padStart(2, '0'));
        };
        return VisitsService_1;
    }());
    __setFunctionName(_classThis, "VisitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisitsService = _classThis;
}();
exports.VisitsService = VisitsService;
