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
exports.CategoryService = void 0;
var typeorm_1 = require("typeorm");
var service_entity_1 = require("./service.entity");
var CategoryService = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('category_services')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _categoryServiceId_decorators;
    var _categoryServiceId_initializers = [];
    var _categoryServiceId_extraInitializers = [];
    var _categoryName_decorators;
    var _categoryName_initializers = [];
    var _categoryName_extraInitializers = [];
    var _services_decorators;
    var _services_initializers = [];
    var _services_extraInitializers = [];
    var CategoryService = _classThis = /** @class */ (function () {
        function CategoryService_1() {
            this.categoryServiceId = __runInitializers(this, _categoryServiceId_initializers, void 0);
            this.categoryName = (__runInitializers(this, _categoryServiceId_extraInitializers), __runInitializers(this, _categoryName_initializers, void 0));
            this.services = (__runInitializers(this, _categoryName_extraInitializers), __runInitializers(this, _services_initializers, void 0));
            __runInitializers(this, _services_extraInitializers);
        }
        return CategoryService_1;
    }());
    __setFunctionName(_classThis, "CategoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _categoryServiceId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)({ name: 'category_service_id' })];
        _categoryName_decorators = [(0, typeorm_1.Column)({ name: 'category_name', type: 'varchar', length: 255 })];
        _services_decorators = [(0, typeorm_1.OneToMany)(function () { return service_entity_1.Service; }, function (service) { return service.category; })];
        __esDecorate(null, null, _categoryServiceId_decorators, { kind: "field", name: "categoryServiceId", static: false, private: false, access: { has: function (obj) { return "categoryServiceId" in obj; }, get: function (obj) { return obj.categoryServiceId; }, set: function (obj, value) { obj.categoryServiceId = value; } }, metadata: _metadata }, _categoryServiceId_initializers, _categoryServiceId_extraInitializers);
        __esDecorate(null, null, _categoryName_decorators, { kind: "field", name: "categoryName", static: false, private: false, access: { has: function (obj) { return "categoryName" in obj; }, get: function (obj) { return obj.categoryName; }, set: function (obj, value) { obj.categoryName = value; } }, metadata: _metadata }, _categoryName_initializers, _categoryName_extraInitializers);
        __esDecorate(null, null, _services_decorators, { kind: "field", name: "services", static: false, private: false, access: { has: function (obj) { return "services" in obj; }, get: function (obj) { return obj.services; }, set: function (obj, value) { obj.services = value; } }, metadata: _metadata }, _services_initializers, _services_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CategoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CategoryService = _classThis;
}();
exports.CategoryService = CategoryService;
