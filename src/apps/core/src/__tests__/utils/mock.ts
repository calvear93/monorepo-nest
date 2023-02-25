export type Mock<T> = {
	[P in keyof T]?: Mock<T[P]>;
};

/**
 * Type assertion for
 * create type-safe
 * partial mocks.
 *
 * @template T
 * @param mockObj
 *
 * @returns type narrowed object
 */
export function mock<T>(mockObj: Mock<T>): T {
	return mockObj as T;
}
