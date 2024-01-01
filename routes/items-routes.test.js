process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let newItem = {name: "Test", price:2};

beforeEach(function(){
    items.push(newItem)
});

afterEach(function(){
    items.length = 0;
});

describe("Show items", function(){
    test("Show all items", async function(){
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items: [newItem]});
    })
    test("Show searched item", async function(){
        const resp = await request(app).get(`/items/${newItem.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({item: newItem});
    })
})

describe("Add, update, delete items", function(){
    test("Add item", async function(){
        const resp = await request(app).post("/items").send({name:"Mars", price:1.65});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({added: {name:"Mars", price:1.65}})
    })

    test('Update', async function(){
        const resp = await request(app).patch(`/items/${newItem.name}`).send({name: "Test", price:1.59})
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: {name: "Test", price:1.59}})
    })
    
    test('Delete', async function(){
        const resp = await request(app).delete(`/items/${newItem.name}`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({message: "Deleted"})
    })
    
})