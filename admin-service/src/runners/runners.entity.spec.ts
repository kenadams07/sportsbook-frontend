import { Runners } from './runners.entity';

describe('RunnersEntity', () => {
  it('should be defined', () => {
    expect(Runners).toBeDefined();
  });

  it('should have the correct properties', () => {
    const runner = new Runners();
    expect(runner).toHaveProperty('id');
    expect(runner).toHaveProperty('name');
    expect(runner).toHaveProperty('createdAt');
    expect(runner).toHaveProperty('updatedAt');
  });
});