export const CHANGE_COLOR = 'CHANGE_COLOR';

export function changeColor(color) {
  return {
    type: CHANGE_COLOR,
    color
  };
}
