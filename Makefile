test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec \
		--ui exports \
		test/*.test.js

.PHONY: test
