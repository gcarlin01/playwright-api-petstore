import { test, expect } from '@playwright/test';
import fs from 'fs';
import FormData from 'form-data';

test.describe ("Pet API", () => {

  test('uploads an image for existing pet[/pet/{petId}/uploadImage]', async ({ request }) => {
    
    const fileName = 'rayo.jpeg';
    const url = 'https://petstore.swagger.io/v2/pet/789/uploadImage';
  
    const fileBuffer = await fs.promises.readFile(fileName);
    const message = "rayo el perro maloso";
  
    const formData = new FormData();
    formData.append('file', fileBuffer);
    formData.append('additionalMetadata', message);
  
    const boundary = formData.getBoundary();
    const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    };
  
    const response = await request.post(url, {
      data: formData.getBuffer().toString(),
      headers,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toContain('rayo el perro maloso');
  });
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

  test('updates a pet [/pet]', async({ request }) => {
    const result = await request.put('https://petstore.swagger.io/v2/pet', { data: {
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

  test('get pet by status [/pet/findByStatus]', async ({ request }) => {
    const response = await request.get('https://petstore.swagger.io/v2/pet/findByStatus', {
      params: {
        status: 'available',
      }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody[0].status).toBe('available');
  });
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
    console.log(responseBody)
    const actualPetId = responseBody.id;
    expect(actualPetId).toEqual(petId);
    expect (responseBody.name).toEqual('Sofia');
  });

  test('updates a pet with form data [/pet/{petId}]', async({ request }) => {
    const result = await request.post('https://petstore.swagger.io/v2/pet/123', { form: {
      name: 'Sofia the cat',
      status: 'sold'
  }
  });
  console.log(result)
  expect(result.status()).toBe(200);
  const resultBody = await result.json();
  console.log(resultBody)
  expect(resultBody.message).toEqual("123");
  
  const response = await request.get('https://petstore.swagger.io/v2/pet/123');
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody)
    const actualPetId = responseBody.id;
    expect(actualPetId).toEqual(123);
    expect (responseBody.name).toEqual('Sofia the cat');
    expect (responseBody.status).toEqual('sold');
  })

  test('delete a pet [/pet/{petId}]', async ({ request }) => {
    const response = await request.post('https://petstore.swagger.io/v2/pet', { data: {
      id: 321,
      category: {
        id: 123,
        name: "t-rex"
      },
      name: "Rex",
      photoUrls: [],
      tags: [
        {
          id: 111,
          name: "green"
        }
      ],
      status: "available"
      }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const petId = responseBody.id;
    const result = await request.delete(`https://petstore.swagger.io/v2/pet/`+petId, { headers :{
      api_key : "special-key",
  } });
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    expect(resultBody.message).toEqual('321');
  });
 

  
});