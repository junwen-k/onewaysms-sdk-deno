default: test

mock-server:
	deno run --allow-net _mock_server.ts

test:
	deno test --allow-net=localhost oneway_test.ts
