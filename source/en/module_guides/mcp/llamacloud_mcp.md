---
title: LlamaParse MCP | Developer Documentation
description: MCP integration to connect the LlamaParse Platform to any MCP client.
---

The LlamaParse MCP is a [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes the LlamaParse Platform’s document-processing capabilities (Parse, Classify, Extract, Split, and Index) as tools that any MCP-compatible agent can call. Instead of wiring up the REST API or SDK yourself, you connect your agent to the MCP server once and let it parse documents, extract structured data, classify and split files, and build, refresh, and retrieve from your indexes directly.

The server is open source and hosted at [`https://mcp.llamaindex.ai`](https://mcp.llamaindex.ai).

Note

`mcp.llamaindex.ai` serves the North America region and `mcp.eu.llamaindex.ai` serves Europe. Which one you use is decided by where your LlamaCloud account lives, not by a per-connection setting: an account on `cloud.llamaindex.ai` uses the North America server, and an account on `cloud.eu.llamaindex.ai` uses the Europe one. A token issued in one region is rejected by the other with a `401` that names the correct endpoint. See [Regions](../../general/regions/) for the full list of regional endpoints.

## Authentication

The MCP server accepts two credentials, and both resolve to the same account and the same permissions.

**OAuth** is what most MCP clients use, and what every configuration on this page uses unless you add a header. You sign in once, in your client; authentication happens automatically on first use, and tokens refresh without manual intervention.

**A LlamaCloud API key** works where a browser sign-in does not — headless agents, CI jobs, and clients with no OAuth support. Send it as the bearer token when you add the server:

Terminal window

```
claude mcp add --transport http llamaparse https://mcp.llamaindex.ai/mcp \
  --header "Authorization: Bearer $LLAMA_CLOUD_API_KEY"
```

See the [API key guide](../../general/api_key/) to create one.

The two differ in one place: `getUploadUrl` is not available to API-key callers, because it stores the caller’s credential for the upload route to spend — bounded for an expiring token, unbounded for a key. Use `uploadFileByUrl` instead, or connect with OAuth.

## Connecting an MCP client

Connect to the unified endpoint `https://mcp.llamaindex.ai/mcp` to get the full platform surface area (Parse, Classify, Extract, Split, and Index) in one server.

- [Cursor](#tab-panel-701)
- [VS Code](#tab-panel-702)
- [Claude Code](#tab-panel-703)
- [Claude](#tab-panel-704)
- [Codex](#tab-panel-705)

Click the button to add the server in one click:

[Open in Cursor ](cursor://anysphere.cursor-deeplink/mcp/install?name=llamaparse\&config=eyJ1cmwiOiJodHRwczovL21jcC5sbGFtYWluZGV4LmFpL21jcCJ9)

Or add the server manually to `~/.cursor/mcp.json`:

```
{
  "mcpServers": {
    "llamaparse": {
      "type": "http",
      "url": "https://mcp.llamaindex.ai/mcp"
    }
  }
}
```

Click the button to add the server in one click:

[Open in VS Code ](vscode:mcp/install?%7B%22name%22%3A%22llamaparse%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//mcp.llamaindex.ai/mcp%22%7D)

Or add the server manually to your `settings.json`:

```
{
  "mcp": {
    "servers": {
      "llamaparse": {
        "type": "http",
        "url": "https://mcp.llamaindex.ai/mcp"
      }
    }
  }
}
```

Terminal window

```
claude mcp add --transport http llamaparse https://mcp.llamaindex.ai/mcp
```

LlamaParse is a listed connector in Claude’s connector directory, so there is nothing to configure. In Claude, go to **Customize → Connectors**, search for LlamaParse, and connect. The directory is shared across Claude on the web, Claude Desktop, and Claude mobile, so connecting once covers all of them.

[Open connectors in Claude Desktop ](claude://claude.ai/settings/connectors)

The listing connects to the North America server. To use the Europe server, or to pin a product-specific endpoint, add it yourself under **Customize → Connectors**, or edit Claude Desktop’s `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows). The configuration below uses the North America unified endpoint — swap the host for `https://mcp.eu.llamaindex.ai/mcp` for Europe, or the path for a product-specific server such as `/parse/mcp`:

```
{
  "mcpServers": {
    "llamaparse": {
      "type": "http",
      "url": "https://mcp.llamaindex.ai/mcp"
    }
  }
}
```

Open Codex settings to add the server:

[Open in Codex ](codex://settings)

Or add through the CLI:

Terminal window

```
codex mcp add llamaparse --url https://mcp.llamaindex.ai/mcp
```

If you connected with OAuth, the first time your agent uses a tool you’ll be prompted to authenticate through your browser.

### EU region

Accounts in the Europe region connect to `https://mcp.eu.llamaindex.ai/mcp` instead. The tool surface and the OAuth flow are identical to North America — only the host changes. The Claude connector directory listing points at the North America server, so Europe accounts add the server manually rather than installing it from the directory.

Click a button to add the Europe server in one click:

[Open in Cursor  ](cursor://anysphere.cursor-deeplink/mcp/install?name=llamaparse\&config=eyJ1cmwiOiJodHRwczovL21jcC5ldS5sbGFtYWluZGV4LmFpL21jcCJ9)[Open in VS Code ](vscode:mcp/install?%7B%22name%22%3A%22llamaparse%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//mcp.eu.llamaindex.ai/mcp%22%7D)

Or add the server manually, in the same file and shape your client uses above — for Cursor, that is `~/.cursor/mcp.json`:

```
{
  "mcpServers": {
    "llamaparse-eu": {
      "type": "http",
      "url": "https://mcp.eu.llamaindex.ai/mcp"
    }
  }
}
```

From the CLI:

Terminal window

```
# Claude Code
claude mcp add --transport http llamaparse-eu https://mcp.eu.llamaindex.ai/mcp


# Codex
codex mcp add llamaparse-eu --url https://mcp.eu.llamaindex.ai/mcp
```

The `llamaparse-eu` name keeps the Europe server distinct from a `llamaparse` entry pointing at North America, so both can stay installed side by side. The one-click buttons above install under the name `llamaparse`, so rename that entry if you already have the North America server configured.

## Available tools

The server groups its tools by product. The project and upload helpers below are carried by every endpoint — the unified one and each product-specific one — because the processing tools all take a file ID and, for accounts with more than one project, a project ID.

### Projects and uploads

- **`getUserProjects`** — lists the projects your account can reach, so an agent can resolve a project by name and pass the right project ID to the other tools.
- **`uploadFileByUrl`** — accepts a public file URL, fetches the file, and uploads it to the platform.
- **`getUploadUrl`** — returns a temporary, authenticated upload endpoint your client can `POST` a local file to via multipart form data.

### Parse

- **`parseFile`** — runs a [Parse](../../parse/getting_started/) job over a file and returns clean markdown or plain text.
- **`parseWithLiteParse`** — runs LiteParse over a PDF, a fast parser that costs no Parse credits. PDFs only, and best on text-dense documents with straightforward layouts.
- **`estimateFileComplexity`** — scores a PDF page by page and returns, for each page, the Parse tier it needs or whether LiteParse is enough. Pair it with `parseFile` and `parseWithLiteParse` to send only the pages that need it to the heavier tiers.

### Classify

- **`classifyFile`** — assigns a document to one of your categories using [Classify](../../classify/). On the unified and Classify servers the categories are a required argument on every call, so an agent can decide them per file without creating a saved configuration first. On a pinned `/classify/{configId}/mcp` server they come from the configuration and the argument is not offered.

### Split

- **`splitFile`** — segments a document into logical sections using [Split](../../split/getting_started/). Like `classifyFile`, it takes its categories inline, except on a pinned `/split/{configId}/mcp` server.

### Extract

[Structured extraction](../../extract/) is more reliable through dedicated tools than asking an agent to read a parsed document and pull fields out of the text: agents may only receive a truncated version of large documents, and prompt-only extraction leaves the output schema underspecified.

- **`searchSchemaTemplates`** — searches a built-in catalog of starter schemas (invoice, contract, resume and others) and returns the matches with their template IDs.
- **`getSchemaTemplate`** — returns one template’s full JSON schema by ID, so an agent can read it and adapt it before use.
- **`createExtractionConfigFromSchema`** — creates an extraction configuration from either a template ID or an explicit JSON schema, and returns the configuration ID. This is the tool that lets an agent build a configuration on the fly.
- **`generateExtractionConfig`** — generates a JSON schema and extraction rules from a description of the data you want, using a sample file. Also returns a configuration ID.
- **`extractFile`** — runs extraction against a file using an extraction configuration ID.

### Index

[Index](../../cloud-index-v2/getting_started/) is the managed knowledge base offered by the LlamaParse Platform, built for agentic workflows. Beyond semantic search, it gives agents file-system-like access to the underlying documents. The tools cover both halves of that: building an index and querying one.

An index is built over a directory of source documents, so the build flow is upload the files, put them in a directory, then index it:

- **`createDirectory`** — creates a directory, the folder of source documents an index is built over.
- **`addFilesToDirectory`** — adds already-uploaded files to a directory, using the file IDs returned by the upload helpers. Files are added one at a time and the response reports which succeeded, so you retry only the failures.
- **`createIndex`** — indexes a directory. Indexing runs in the background, and the index isn’t queryable until it reports ready.
- **`syncIndex`** — re-indexes a directory to pick up files added or changed since the last run. An index doesn’t refresh on its own, so this is how an existing one sees new documents.
- **`getIndexStatus`** — reports whether an index has finished building. Querying an index that isn’t ready yet looks the same as querying one with no matching documents, so poll this after `createIndex` and `syncIndex`.
- **`listDirectories`** — lists the directories in a project, one page at a time.
- **`listDirectory`** — lists the files inside a directory, one page at a time.

Searching and reading an index:

- **`listIndexes`** — discovers the indexes you can query.
- **`findFilesInIndex`** — locates relevant files within an index.
- **`readFileFromIndex`** — reads the contents of a file in an index.
- **`grepFileFromIndex`** — searches for pattern matches within indexed files.
- **`retrieveFromIndex`** — performs hybrid (sparse + dense) retrieval over an index.

### API keys

Carried by the unified `/mcp` endpoint only — the product-specific servers do not expose it.

- **`createProjectApiKey`** — creates an API key scoped to a single project, for handing to an application or a teammate. The key reaches only that project, so an agent can finish setting a project up rather than stopping to ask you for a key. The secret comes back once and cannot be read again — store it when it is returned, or revoke the key and create another. Every key this tool creates expires; 90 days is both the default and the longest this tool will issue. The web UI offers longer lifetimes, up to a key that never expires.

## Product-specific servers

The unified `/mcp` endpoint exposes every capability, which is ideal for exploratory work and broader document-processing tasks. When you want a more focused tool list, you can connect directly to a product-specific server instead. Narrowing the scope helps agents make tool-selection decisions more reliably and run independent tasks in parallel.

The server tree looks like this:

```
https://mcp.llamaindex.ai/
├── mcp                       # full platform: Parse, Classify, Extract, Split, Index
├── parse
│   └── /mcp
├── classify
│   ├── /mcp
│   └── /{configId}/mcp
├── extract
│   ├── /mcp
│   └── /{configId}/mcp
├── split
│   ├── /mcp
│   └── /{configId}/mcp
└── index
    └── /mcp
```

The same subpaths exist under `https://mcp.eu.llamaindex.ai/` for accounts in the Europe region.

Every product-specific server carries `getUserProjects` and both upload helpers, plus its own tools:

| Server          | Tools beyond the shared helpers                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/parse/mcp`    | `parseFile`, `parseWithLiteParse`, `estimateFileComplexity`                                                                 |
| `/classify/mcp` | `classifyFile`                                                                                                              |
| `/split/mcp`    | `splitFile`                                                                                                                 |
| `/extract/mcp`  | `searchSchemaTemplates`, `getSchemaTemplate`, `createExtractionConfigFromSchema`, `generateExtractionConfig`, `extractFile` |
| `/index/mcp`    | every Index tool listed above                                                                                               |

The `classify`, `extract`, and `split` servers can optionally inherit a configuration ID directly from the route. When you connect to a `/{configId}/mcp` endpoint, the agent operates with that configuration already in context: `classifyFile` takes its categories from it, `splitFile` its categories and splitting strategy, and `extractFile` its schema — so the pinned extract server serves `extractFile` alone and drops every configuration-building tool.

For example, to connect an agent directly to a specific classification configuration:

```
{
  "mcpServers": {
    "classify-folder-1": {
      "type": "http",
      "url": "https://mcp.llamaindex.ai/classify/CONFIG_ID/mcp"
    }
  }
}
```

And, in parallel, to a specific extraction configuration:

```
{
  "mcpServers": {
    "extract-folder-1": {
      "type": "http",
      "url": "https://mcp.llamaindex.ai/extract/EXTRACT_CONFIG_ID/mcp"
    }
  }
}
```

This modular model lets you compose workflows from multiple specialized servers, each responsible for a well-defined task, improving isolation, enabling greater parallelism, and giving you fine-grained control over throughput.

### Choosing a configuration

How an agent selects a configuration depends on the product, because Classify and Split carry theirs in the call while Extract refers to a saved one.

**Classify and Split take their configuration inline.** `categories` is a required argument on every `classifyFile` and `splitFile` call, so an agent decides per file and nothing has to be saved first. Pass different categories on the next call and the behavior changes with it. The exception is a pinned server, below, which supplies them and drops the argument.

**Extract refers to a configuration by ID.** `extractFile` requires a `configurationId`, so the configuration has to exist before the call. An agent has three ways to get one:

- Build one from a starter schema — call `searchSchemaTemplates` to find a template, optionally `getSchemaTemplate` to read and adapt it, then `createExtractionConfigFromSchema` to create the configuration and get its ID back.
- Build one from a sample file — call `generateExtractionConfig` with a file and a description of the data you want.
- Reuse a saved one — take the ID of an existing configuration from the Extract Configurations page in the web UI and pass it straight to `extractFile`.

**Or pin the configuration to the connection.** Connecting to a `/{configId}/mcp` endpoint puts the configuration in context for the whole session, and the agent never chooses. Use this when the configuration is fixed and you would rather the agent not vary it.

There is no tool for listing the configurations already saved in a project, so an agent either creates one during the session or is given an ID to use.

## Example workflows

- **Classify, then extract** — an agent classifies the files in a folder using a classification server, organizes them into category-specific subfolders, then runs the matching extraction configuration against each category in parallel and saves the results as JSON for downstream analysis.
- **Agentic retrieval** — an agent discovers indexes with `listIndexes`, locates relevant files with `findFilesInIndex`, inspects them with `readFileFromIndex`, searches with `grepFileFromIndex`, and retrieves passages with `retrieveFromIndex` — navigating PDFs, Office documents, images, and other unstructured files the way it would a file system.
- **Build a knowledge base from scratch** — an agent uploads a batch of files with `uploadFileByUrl` or `getUploadUrl`, groups them with `createDirectory` and `addFilesToDirectory`, calls `createIndex`, polls `getIndexStatus` until the index is ready, and then queries it. Later runs add files to the same directory and call `syncIndex` to fold them in.
- **Parse only what needs it** — an agent runs `estimateFileComplexity` over a PDF, sends the pages that need a heavier tier to `parseFile`, and handles the rest with `parseWithLiteParse`.

Tip

The unified `/mcp` server is the best starting point for prototyping. Reach for the product-specific servers once you know which capabilities a workflow needs and want tighter scoping or more parallelism.

## Related

- [Skills and Plugins](../skills/) — install the MCP server and a parsing skill together with the `llamaparse-mcp` plugin, or give a coding agent the skills alone.
- [LlamaParse Platform n8n Node](../integrations/n8n/) — the same capabilities as nodes in a no-code workflow.
