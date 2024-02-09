import { test, expect } from '@playwright/test';

test.describe ("Pet API", () => {
  test('creates a new pet [/pet]', async({ request }) => {
    const result = await request.post('https://petstore.swagger.io/v2/pet', { data: {
      name: 'doggie',
      photoUrls: []
    }})
    const resultBody = await result.json();
    
    expect(result.status()).toBe(200);
    expect(resultBody.name).toEqual('doggie')
  })
});