// TODO: Importar el servicio real cuando exista o indicar la ruta correcta
// import { KoyweService } from '@/infrastructure/third-party/koywe/koywe.service';

// Definimos un tipo genérico por ahora
export interface MockKoyweService {
    createQuote: jest.Mock;
    createOrder: jest.Mock;
    getTransaction: jest.Mock;
}

export const createKoyweMock = (): MockKoyweService => {
    const mock = {
        createQuote: jest.fn(),
        createOrder: jest.fn(),
        getTransaction: jest.fn(),
    } as unknown as MockKoyweService;

    // --- Helpers ---

    (mock as any).givenCreateQuoteSucceeds = (quoteId = 'quote_123', rate = 6.96) => {
        mock.createQuote.mockResolvedValue({
            id: quoteId,
            exchangeRate: rate,
            expiry: new Date(Date.now() + 300000).toISOString() // 5 mins
        });
        return mock;
    };

    (mock as any).givenCreateOrderSucceeds = (orderId = 'order_abc', status = 'PENDING') => {
        mock.createOrder.mockResolvedValue({
            id: orderId,
            status: status,
            paymentUrl: `https://checkout.koywe.com/${orderId}`
        });
        return mock;
    };

    return mock;
};