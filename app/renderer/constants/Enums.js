export const DependencyStatusEnum = Object.freeze({
	IDLE: 0,
	INSTALLING: 1,
	UNINSTALLING: 2
});

export const DependencyUpdateTypeEnum = Object.freeze({
	RELEASE: 0,
	PATCH: 1,
	MINOR: 2,
	MAJOR: 3
});

export const DependencyCategoryEnum = Object.freeze({
	PROD: 'dependencies',
	DEV: 'devDependencies'
});

export const ScriptStatusEnum = Object.freeze({
	IDLE: 0,
	RUNNING: 1
});
