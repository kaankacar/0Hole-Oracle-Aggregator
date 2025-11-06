import { createMocks } from 'node-mocks-http';

describe('/api/price', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('returns a successful response with the expected data structure', async () => {
    jest.doMock('@pythnetwork/price-service-client', () => ({
      PriceServiceConnection: jest.fn(() => ({
        getLatestPriceFeeds: jest.fn().mockResolvedValue([{
          price: { price: 150 * (10 ** 8), expo: -8 },
        }]),
      })),
    }));
    jest.doMock('@chainlink/solana-sdk', () => ({
      OCR2Feed: {
        load: jest.fn().mockResolvedValue({
          getLatestRound: jest.fn().mockResolvedValue({
            answer: { toNumber: () => 160 * (10 ** 8) },
          }),
        }),
      },
    }));

    const { req, res } = createMocks({ method: 'GET' });
    const { default: handler } = await import('./price');
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      pythPrice: '150.00',
      chainlinkPrice: '160.00',
      averagePrice: '155.00',
    });
  });

  it('returns a 500 error if fetching Pyth price fails', async () => {
    jest.doMock('@pythnetwork/price-service-client', () => ({
      PriceServiceConnection: jest.fn(() => ({
        getLatestPriceFeeds: jest.fn().mockRejectedValue(new Error('Pyth error')),
      })),
    }));
    jest.doMock('@chainlink/solana-sdk', () => ({
      OCR2Feed: {
        load: jest.fn().mockResolvedValue({
          getLatestRound: jest.fn().mockResolvedValue({
            answer: { toNumber: () => 160 * (10 ** 8) },
          }),
        }),
      },
    }));

    const { req, res } = createMocks({ method: 'GET' });
    const { default: handler } = await import('./price');
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Pyth error');
  });

  it('returns a 500 error if fetching Chainlink price fails', async () => {
    jest.doMock('@pythnetwork/price-service-client', () => ({
      PriceServiceConnection: jest.fn(() => ({
        getLatestPriceFeeds: jest.fn().mockResolvedValue([{
          price: { price: 150 * (10 ** 8) },
        }]),
      })),
    }));
    jest.doMock('@chainlink/solana-sdk', () => ({
      OCR2Feed: {
        load: jest.fn().mockRejectedValue(new Error('Chainlink error')),
      },
    }));

    const { req, res } = createMocks({ method: 'GET' });
    const { default: handler } = await import('./price');
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Chainlink error');
  });
});
