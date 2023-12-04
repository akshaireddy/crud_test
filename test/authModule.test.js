const { expect } = require('chai');
const supertest = require('supertest');
// const app = require('../index');
// const authModule = require('../src/authModule');
const app = require('../src/authModule');


describe('Express App Endpoints', () => {
  let userId;
  let authToken; // Add this variable to store the authentication token

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await supertest(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('user');
      expect(response.body.user.username).to.equal('testuser');
      userId = response.body.user.id;
    });

    it('should return 400 for duplicate username', async () => {
      const response = await supertest(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password456' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Username already exists');
    });
  });

  describe('POST /login', () => {
    it('should authenticate a user', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      authToken = response.body.token; // Store the token for future requests
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'nonexistentuser', password: 'invalidpassword' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Invalid credentials');
    });
  });

  describe('GET /getUser', () => {
    it('should get user details', async () => {
      const response = await supertest(app)
        .get(`/getUser/${userId}`)
        .set('Authorization', `Bearer ${authToken}`); // Include the auth token in the request headers

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id');
      expect(response.body.id).to.equal(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await supertest(app)
        .get('/getUser/nonexistentid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('User not found');
    });
  });

  describe('PUT /updateUser', () => {
    it('should update user details', async () => {
      const response = await supertest(app)
        .put(`/updateUser/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'newusername' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id');
      expect(response.body.username).to.equal('newusername');
   });

    it('should return 404 for non-existent user', async () => {
      const response = await supertest(app)
       .put('/updateUser/nonexistentid')
       .set('Authorization', `Bearer ${authToken}`)
       .send({ username: 'newusername' });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('User not found');
    });
});

  describe('DELETE /deleteUser', () => {
    it('should delete a user', async () => {
      const response = await supertest(app)
        .delete(`/deleteUser/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await supertest(app)
        .delete('/deleteUser/nonexistentid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('User not found');
    });
  });

  // describe('Accessing protected routes without authentication', () => {
  //   it('should return 401', async () => {
  //     const response = await supertest(app)
  //       .get(`/getUser/${userId}`);

  //     expect(response.status).to.equal(401);
  //     expect(response.body).to.have.property('error');
  //     expect(response.body.error).to.equal('Unauthorized');
  //   });

  
  // });

});
