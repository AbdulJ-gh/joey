type Deps = {
	cache: Cache
	fauna: number
}

const dependencies: Deps = {
	cache: caches.default,
	fauna: 100
};

// OR
// type Deps = typeof dependencies

export { dependencies, Deps };
