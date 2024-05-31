import useDateFormatter from '../useDateFormatter';

describe('useDateFormatter hook testing', () => {
  it('Should output the correct date', () => {
    const dateStr = '2024-03-18';
    const output = useDateFormatter(dateStr);
    expect(output).toMatch('18-mar 2024');
  });
});
