describe('Basic', () => {
  it('should see orders-service calling emails-service', async () => {
    const sequence = axios.req();
    expect(sequence.service('orders-kimera'))
      .toCall('meerkats-kimera')
      .withHttpBody({})
      .withBla();
  });
});
