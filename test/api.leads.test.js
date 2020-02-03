/*
Node wrapper for Freshdesk v2 API

Copyright (C) 2016-2017 Maksim Koryukov <maxkoryukov@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the MIT License, attached to this software package.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

You should have received a copy of the MIT License along with this
program. If not, see <https://opensource.org/licenses/MIT>.

http://spdx.org/licenses/MIT
*/

'use strict'

const nock = require('nock')

const Freshdesk = require('..')

describe('api.leads', function () {

	const freshdesk = new Freshdesk('https://test.freshdesk.com', 'TESTKEY')

	describe('update', () => {

		it('should send PUT request to /api/v2/leads/NNNN', (done) => {

			const res = {
				"id": 22000991607,
				"deleted": false,
				"description": null,
				"email": "gwuzi@mail.ru"
			}

			// SET UP expected request

			nock('https://test.freshdesk.com')
				.put('/api/v2/leads/22000991607', {
					"email": "gwuzi@mail.ru"
				})
				.reply(200, res)


			freshdesk.updateLead(22000991607, {
				"email": "gwuzi@mail.ru"
			}, (err, data, extra) => {
				expect(err).is.null
				expect(data).to.deep.equal(res)
				expect(extra).to.exist
				done()
			})
		})
	})

	describe('get', () => {

		it('should send GET request to /api/v2/leads/NNNN', (done) => {

			const res = {
				"id": 22000991607,
				"deleted": false,
				"description": null,
				"email": "gwuzi@mail.ru"
			}

			// SET UP expected request

			nock('https://test.freshdesk.com')
				.get('/api/v2/leads/22000991607')
				.reply(200, res)


			freshdesk.getLead(22000991607, (err, data, extra) => {
				expect(err).is.null
				expect(data).to.deep.equal(res)
				expect(extra).to.exist
				done()
			})
		})
	})

	describe('listAllLeads', () => {

		it('should send GET request to /api/v2/leads', (done) => {

			const res = [{
					"id": 22000991607,
					"deleted": false,
					"description": null,
					"email": "gwuzi@mail.ru"
				}, {
					"id": 22000991608,
					"deleted": false,
					"description": null,
					"email": "donna@example.com"
				}

			]

			// SET UP expected request

			nock('https://test.freshdesk.com')
				.get('/api/v2/leads')
				.query({
					"page": 12,
					"per_page": 10
				})
				.reply(200, res, {
					"link": '< https://test.freshdesk.com/api/v2/leads?page=13&per_page=10>;rel="next"',
				})

			const options = {
				"page": 12,
				"per_page": 10,
			}

			freshdesk.listAllLeads(options, (err, data, extra) => {
				expect(err).is.null
				expect(data).to.deep.equal(res)
				expect(extra).to.exist
				expect(extra).to.be.an('object')
					.that.have.property('pageIsLast', false)

				done()
			})
		})
	})

	describe('filter leads', () => {

		it('should send GET request to /api/v2/search/leads with query string', (done) => {

			const res = {
				"total": 1,
				"results": [{
					"active": true,
					"address": "11 Park Avenue,",
					"company_id": 331,
					"description": "alien hero",
					"email": "john@marsspace.com",
					"id": 112,
					"job_title": "Superhero",
					"language": "en",
					"mobile": "992339928",
					"name": "John Jonz",
					"phone": "+1992842882",
					"time_zone": "Eastern Time (US & Canada)",
					"twitter_id": "martian",
					"custom_fields": {
						"location": "Watch tower",
						"sector": "outer space"
					},
					"lead_score": 0,
					"lead_quality": "Cold",
					"created_at": "2017-07-19T12:29:36Z",
					"updated_at": "2017-07-19T12:38:26Z"
				}, ]
			}


			// SET UP expected request

			const filter = "name:John Jonz"

			nock('https://test.freshdesk.com')
				.get(`/api/v2/search/leads?query=%22name:John%20Jonz%22`)
				.reply(200, res)

			freshdesk.filterLeads(filter, (err, data) => {
				expect(err).is.null
				expect(data).to.deep.equal(res)
				done()
			})

		})

	})
})
