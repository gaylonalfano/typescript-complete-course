// Add an auto-bind Decorator to simplify .bind(this)
export function autobind(
  /* target: any, */
  /* methodName: string, */
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  // methodName to which our autobind() is bound
  // descriptor is the PropertyDescriptor of methodName. Methods in the end are just
  // properties which hold functions.
  // First: let's get access to original method we're decorating
  const originalMethod = descriptor.value;
  // Second: Create adjusted descriptor
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      // Executed when we try to access the function
      // Set up the boundFunction by adding .bind(this) to originalMethod
      const boundFn = originalMethod.bind(this);
      // Now let's return this new boundFn
      return boundFn;
    },
  };
  // Third: Return the adjustedDescriptor in our decorator
  return adjustedDescriptor;
}
