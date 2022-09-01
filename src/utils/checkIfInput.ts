export function checkIfInput(ev: KeyboardEvent): boolean {
  const target = ev.target as HTMLElement | null;
  if (
    target?.tagName.toLowerCase() === 'input' ||
    target?.tagName.toLowerCase() === 'textarea' ||
    (target?.attributes as any).role?.value === 'textbox'
  ) {
    return true;
  }

  return false;
}
