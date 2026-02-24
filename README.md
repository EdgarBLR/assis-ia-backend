# Backend Setup Guide

## 📦 What Was Created

### Files
- `server.js` - Express server with Notion API integration
- `.env` - Environment variables with Notion credentials
- `test-api.js` - API testing script

### Dependencies Installed
```bash
npm install express dotenv cors @notionhq/client
```

## 🚀 Server Endpoints

### 1. Health Check
```
GET /
```
Returns server status and Notion configuration status.

### 2. Fetch All Tasks
```
POST /tarefas
```
Fetches all tasks from the Notion database.

### 3. Fetch Tasks by Client
```
POST /tarefas/cliente
Body: { "cliente": "Client Name" }
```
Fetches tasks filtered by client name.

## ⚙️ Configuration

### Environment Variables (.env)
```
NOTION_TOKEN=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
NOTION_DATABASE_ID=2e42a55a7ac940cfb846b85d5f53ebc0
PORT=3000
```

## 🧪 Testing

Run the test script:
```bash
node test-api.js
```

## ⚠️ Important Notes

### Notion Database Requirements
Your Notion database must have a **"Cliente"** property (type: Title) for the client filter to work.

### Sharing the Database
Make sure to share your Notion database with the integration:
1. Open database in Notion
2. Click ⋯ menu → "Add connections"
3. Select your integration

## 🔧 Troubleshooting

If tasks return `undefined`:
- Verify the database is shared with the integration
- Check that the Database ID is correct
- Ensure the integration has read permissions
- Verify the "Cliente" property exists in the database

## 🚀 Running the Server

```bash
node server.js
```

Server will start on port 3000 with Notion integration ready.
