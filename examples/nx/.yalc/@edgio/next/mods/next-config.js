"use strict";
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const OLD_EXPORT_VAR_NAME = '_preEdgioExport';
module.exports = function transformNextConfig(fileInfo, api) {
    // Do not transform the next config file mulitple times
    if (fileInfo.source.indexOf('withEdgio') !== -1) {
        return fileInfo.source;
    }
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    // TODO - do we need to handle "export default ..."? doesn't seem like it based
    // on docs https://nextjs.org/docs/api-reference/next.config.js/introduction
    const defaultExport = root.find(j.AssignmentExpression, node => { var _a, _b, _c, _d; return ((_b = (_a = node.left) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.name) === 'module' && ((_d = (_c = node.left) === null || _c === void 0 ? void 0 : _c.property) === null || _d === void 0 ? void 0 : _d.name) === 'exports'; });
    const isFunction = defaultExport.get().value.right.type.includes('FunctionExpression');
    const edgioNextConfigRoot = j(fs_extra_1.readFileSync(path_1.join(__dirname, '..', 'default-app', 'all', 'next.config.js')).toString());
    const l0DefaultExport = edgioNextConfigRoot.find(j.AssignmentExpression, node => { var _a, _b, _c, _d; return ((_b = (_a = node.left) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.name) === 'module' && ((_d = (_c = node.left) === null || _c === void 0 ? void 0 : _c.property) === null || _d === void 0 ? void 0 : _d.name) === 'exports'; });
    const withServiceWorkerExpr = edgioNextConfigRoot.find(j.CallExpression, expr => expr.callee.name === 'withServiceWorker');
    const withServiceWorkerArg = withServiceWorkerExpr.find(j.ObjectExpression);
    const existingExportVar = j.identifier(OLD_EXPORT_VAR_NAME);
    defaultExport.replaceWith(j.variableDeclaration('const', [
        j.variableDeclarator(existingExportVar, defaultExport.get().value.right),
    ]));
    const existingResultExpr = isFunction
        ? j.callExpression(existingExportVar, l0DefaultExport.get().value.right.params)
        : existingExportVar;
    const existingResult = j.spreadElement(existingResultExpr);
    withServiceWorkerArg.get().value.properties.push(existingResult);
    const newExportDefault = j.assignmentExpression('=', j.memberExpression(j.identifier('module'), j.identifier('exports')), l0DefaultExport.get().value.right);
    // add the imports from the top of the L0 config file:
    const rootBody = root.get('program').get('body').value;
    edgioNextConfigRoot
        .get('program')
        .get('body')
        .value.forEach((node) => {
        if (node.expression !== l0DefaultExport.get().value) {
            rootBody.unshift(node);
        }
    });
    rootBody.push(j(newExportDefault).toSource());
    return root.toSource();
};
