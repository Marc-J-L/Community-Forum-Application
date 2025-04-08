export const revertObjectKeyValue = (object: Object) => {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
};
