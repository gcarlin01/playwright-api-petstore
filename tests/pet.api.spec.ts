import { test, expect } from '@playwright/test';
import { randomInt } from 'crypto';

test.describe ("Pet API", () => {

  test('creates a new pet [/pet]', async({ request }) => {
    const result = await request.post('https://petstore.swagger.io/v2/pet', { data: {
      id: 789,
      category: {
        id: 1987,
        name: "dalmatian"
      },
      name: "rayo",
      photoUrls: [],
      tags: [
        {
          id: 2727,
          name: "perro-guau-guau"
        }
      ],
      status: "available"
    }
    });
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    expect(resultBody.name).toEqual('rayo')
  })
  test('get pet by id [/pet/{petId}]', async ({ request }) => {
    const result = await request.post('https://petstore.swagger.io/v2/pet', { data: {
      id: 123,
      category: {
        id: 321,
        name: "cat"
      },
      name: "Sofia",
      photoUrls: [],
      tags: [
        {
          id: 111,
          name: "gray"
        }
      ],
      status: "available"
      }
    });
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    const petId = resultBody.id;
    const response = await request.get('https://petstore.swagger.io/v2/pet/'+petId);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const actualPetId = responseBody.id;
    expect(actualPetId).toEqual(petId);
    expect (responseBody.name).toEqual('Sofia');
  });

  test('updates a pet [/pet]', async({ request }) => {
    const result = await request.post('https://petstore.swagger.io/v2/pet', { data: {
      id: 789,
      category: {
        id: 1987,
        name: "pointer-dog"
      },
      name: "rayo",
      photoUrls: [],
      tags: [
        {
          id: 2727,
          name: "perro-maloso"
        }
      ],
      status: "available"

  }
  });
  expect(result.status()).toBe(200);
  const resultBody = await result.json();
  expect(resultBody.category.name).toEqual('pointer-dog');
  expect(resultBody.tags[0].name).toEqual('perro-maloso');
  })
});