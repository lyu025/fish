const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const value = modulesFiles(modulePath);
	modules = Object.assign(modules,value.default);
	return modules
}, {})

module.exports = (vm) => {
	const http = vm.$u.http;
	const api = modules;
	vm.$u.api = api
	// $u.api挂载到uni对象上
	uni.$u.api = api
}
