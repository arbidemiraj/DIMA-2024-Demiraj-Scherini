import { getCategories } from '../usePickImage';

const addCategoriesMock = jest.fn();
const mockLabels = [{ description: 'sports' }, { description: 'activity' }, { description: 'cooking' }];

describe('usePickImage hook testing', () => {
  it('Should return the correct categories from labels', () => {
    const output = getCategories(mockLabels, addCategoriesMock);
    expect(output).toEqual(['sport', 'food']);
  });
});
