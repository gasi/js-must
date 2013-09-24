NODE_OPTS :=
TEST_OPTS :=

love:
	@echo "Feel like makin' love."

test:
	@node $(NODE_OPTS) ./node_modules/.bin/mocha -R dot $(TEST_OPTS)

spec: 
	@node $(NODE_OPTS) ./node_modules/.bin/mocha -R spec $(TEST_OPTS)

autotest:
	@node $(NODE_OPTS) ./node_modules/.bin/mocha -R spec --watch $(TEST_OPTS)

pack:
	npm pack

publish:
	npm publish

# NOTE: Sorry, mocumentation is not yet published.
doc: doc.json
	@mkdir -p doc
	@~/Documents/Mocumentation/bin/mocument \
		--type yui \
		--title Must.js \
		--priority Must,Object \
		tmp/doc/data.json > doc/API.md

toc: doc.json
	@~/Documents/Mocumentation/bin/mocument \
		--type yui \
		--template toc \
		--include Must \
		--var api_url=https://github.com/moll/js-must/blob/master/doc/API.md \
		tmp/doc/data.json

doc.json:
	@mkdir -p tmp
	@yuidoc --exclude test,node_modules --parse-only --outdir tmp/doc .

clean:
	rm -rf tmp

.PHONY: love test spec autotest pack publish doc doc.json
