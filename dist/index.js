/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 980:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 6:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 867:
/***/ ((module) => {

module.exports = eval("require")("semver");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(980)
const github = __nccwpck_require__(6)
const semver = __nccwpck_require__(867)

try {
    const token = core.getInput('token')
    const defaultBump = core.getInput('default-bump')
    const withV = core.getInput('with-v')

    const octokit = github.getOctokit(token)
    const context = github.context
    const { owner: currentOwner, repo: currentRepo } = context.repo

    console.log(currentOwner, currentRepo);
    console.log('OCTOKIT:', octokit.rest.repos.listTags)
    
    console.log(token, defaultBump, withV)
} catch (error) {
  core.setFailed(error.message);
}
})();

module.exports = __webpack_exports__;
/******/ })()
;