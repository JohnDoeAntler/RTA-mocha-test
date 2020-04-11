const chai = require('chai');
const expect = chai.expect;
const url = require('./util').endpoint;
const request = require('supertest')(url);
const secret = require('./util').secret;

//
// ─── GLOBAL VARIABLE FOR STORING THE ID OF CREATED USER ─────────────────────────
//
let id = '';

//
// ─── CREATE ─────────────────────────────────────────────────────────────────────
//
describe('GraphQL', () => {
	it('should create a user.', (done) => {
		request.post(require('./util').request)
		.set('x-hasura-admin-secret', secret)
		.send({ query: `
			mutation {
				insert_users (
					objects: {
						name: "testing name"
						imageUrl: "testing imageUrl"
					}
				) {
					affected_rows
					returning {
						id
						name
						imageUrl
						created_at
						updated_at
					}
				}
			}
		`})
		.expect(200)
		.end((err,res) => {
			if (err) return done(err);

			//
			// ─── CHECK AFFECTED ROWS ─────────────────────────────────────────
			//
			expect(res.body.data.insert_users.affected_rows === 1).true
			//
			// ─── CHECK PROPERTY EXISTENCE ────────────────────────────────────
			//
			expect(res.body.data.insert_users.returning[0]).property("id").have;
			expect(res.body.data.insert_users.returning[0]).property("name").have;
			expect(res.body.data.insert_users.returning[0]).property("imageUrl").have;
			expect(res.body.data.insert_users.returning[0]).property("created_at").have;
			expect(res.body.data.insert_users.returning[0]).property("updated_at").have;

			done();

			id = res.body.data.insert_users.returning[0].id;
		})
	})
});

//
// ─── RETRIEVE ───────────────────────────────────────────────────────────────────
//
describe('GraphQL', () => {
	it('should retrieve the data of created user.', (done) => {
		request.post(require('./util').request)
		.set('x-hasura-admin-secret', secret)
		.send({ query: `
			{
				users_by_pk (
					id: "${id}"
				) {
					id
					name
					imageUrl
					created_at
					updated_at
				}
			}
		`})
		.expect(200)
		.end((err,res) => {
			if (err) return done(err);

			//
			// ─── CHECK PROPERTY EXISTENCE ────────────────────────────────────
			//
			expect(res.body.data.users_by_pk).property("id").have;
			expect(res.body.data.users_by_pk).property("name").have;
			expect(res.body.data.users_by_pk).property("imageUrl").have;
			expect(res.body.data.users_by_pk).property("updated_at").have;
			expect(res.body.data.users_by_pk).property("created_at").have;
			//
			// ─── CHECK DATA CORRESPONDENCE ───────────────────────────────────
			//
			expect(res.body.data.users_by_pk.name === "testing name").true
			expect(res.body.data.users_by_pk.imageUrl === "testing imageUrl").true

			done();
		  })
	 })
});

//
// ─── UPDATE ─────────────────────────────────────────────────────────────────────
//
describe('GraphQL', () => {
	it('should update the created user.', (done) => {
		request.post(require('./util').request)
		.set('x-hasura-admin-secret', secret)
		.send({ query: `
			mutation {
				update_users (
					where: {
						id: {
							_eq: "${id}"
						}
					}
					_set: {
						name: "new name"
						imageUrl: "new imageUrl"
					}
				) {
					affected_rows
					returning {
						id
						name
						imageUrl
						created_at
						updated_at
					}
				}
			}
		`})
		.expect(200)
		.end((err,res) => {
			if (err) return done(err);

			//
			// ─── CHECK AFFECTED ROWS ─────────────────────────────────────────
			//
			expect(res.body.data.update_users.affected_rows === 1).true
			//
			// ─── CHECK PROPERTY EXISTENCE ────────────────────────────────────
			//
			expect(res.body.data.update_users.returning[0]).property("id").have;
			expect(res.body.data.update_users.returning[0]).property("name").have;
			expect(res.body.data.update_users.returning[0]).property("imageUrl").have;
			expect(res.body.data.update_users.returning[0]).property("updated_at").have;
			expect(res.body.data.update_users.returning[0]).property("created_at").have;
			//
			// ─── CHECK WHETHER UPDATED ───────────────────────────────────────
			//
			expect(res.body.data.update_users.returning[0].name === "new name").true
			expect(res.body.data.update_users.returning[0].imageUrl === "new imageUrl").true

			done();
		  })
	 })
});

//
// ─── DELETE ─────────────────────────────────────────────────────────────────────
//
describe('GraphQL', () => {
	it('should delete the created user.', (done) => {
		request.post(require('./util').request)
		.set('x-hasura-admin-secret', secret)
		.send({ query: `
			mutation {
				delete_users (
					where: {
						id: {
							_eq: "${id}"
						}
					}
				) {
					affected_rows
					returning {
						id
						name
						imageUrl
						created_at
						updated_at
					}
				}
			}
		`})
		.expect(200)
		.end((err,res) => {
			if (err) return done(err);

			//
			// ─── CHECK AFFECTED ROWS ─────────────────────────────────────────
			//
			expect(res.body.data.delete_users.affected_rows === 1).true
			//
			// ─── CHECK PROPERTY EXISTENCE ────────────────────────────────────
			//
			expect(res.body.data.delete_users.returning[0]).property("id").have;
			expect(res.body.data.delete_users.returning[0]).property("name").have;
			expect(res.body.data.delete_users.returning[0]).property("imageUrl").have;
			expect(res.body.data.delete_users.returning[0]).property("updated_at").have;
			expect(res.body.data.delete_users.returning[0]).property("created_at").have;
			//
			// ─── CHECK DATA CORRESPONDENCE ───────────────────────────────────
			//
			expect(res.body.data.delete_users.returning[0].name === "new name").true
			expect(res.body.data.delete_users.returning[0].imageUrl === "new imageUrl").true

			done();
		  })
	 })
});