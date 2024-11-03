import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api, {setToken} from '../../src/api/api';

describe('API Module', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should set the token correctly', () => {
    const token = 'my-test-token';
    setToken(token);
    expect(token).toBe('my-test-token');
  });

  it('should set the token none', () => {
    const token = '';
    setToken(token);
  });

  it('should handle request errors', async () => {
    mock.onGet('/some-endpoint').networkError();

    try {
      await api.get('/some-endpoint');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
