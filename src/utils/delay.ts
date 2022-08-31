export function delay(ms: number) {
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      resolve(id);
    }, ms);
  });
}
