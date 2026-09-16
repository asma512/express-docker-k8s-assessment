# Express Docker & Kubernetes Assessment

This repository contains a small, production-style application stack for the Docker, cloud deployment, and Kubernetes assessment. It includes:

- an Express API with MongoDB persistence
- JWT-based authentication for protected routes
- a React front-end built in a multi-stage Docker pipeline
- nginx reverse proxy configuration for /api/ traffic
- Docker Compose orchestration for the API and MongoDB
- Kubernetes manifests for a simple Kind-based deployment

## Project Structure

- src/ — Express application, routes, model, and middleware
- client/ — React app and nginx config
- Dockerfile — backend container image
- docker-compose.yml — API + MongoDB services
- k8s/ — Kubernetes manifests for Deployments and Service
- DEPLOYMENT.md — deployment architecture document
- .env.example — sample environment variables

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop or Docker Engine
- kubectl
- kind (for local cluster validation)

## Local Development

Set up the app locally:

```bash
npm install
cp .env.example .env
npm run dev
```

The API runs on:

- http://localhost:3000

Health check:

```bash
curl http://localhost:3000/health
```

If MongoDB is not running locally, the health endpoint will return a degraded status instead of a full success response.

## Docker Compose

To run the full stack with Express and MongoDB:

```bash
docker compose up --build
```

This starts:

- Express API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

Useful checks:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/books
```

## Example API Calls

List all books:

```bash
curl http://localhost:3000/api/books
```

Register a user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Create a protected book entry:

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"The Hobbit","author":"J.R.R. Tolkien","category":"Fantasy","price":15.99,"inStock":true}'
```

## Client Build

The React client is built with a multi-stage Dockerfile and served by Nginx:

```bash
cd client
npm install
npm run build
```

The Nginx reverse proxy is configured to forward /api/ requests to the backend service.

## Kubernetes (Kind)

Create a local cluster and deploy the app:

```bash
kind create cluster --name book-cluster
kubectl apply -f k8s/
kubectl get pods
kubectl get svc
```

The application should be available through the NodePort service on port 30080.

## Production Notes

- Never commit secrets or environment values to the repository.
- Store real credentials in AWS Secrets Manager or Kubernetes Secrets.
- Use ECR for image storage and EKS for orchestration in production.
- Keep the app small and easy to reason about for review and assessment purposes.

## Submission Summary

This repository is designed to satisfy the Docker, Compose, and Kubernetes assessment requirements with a minimal but complete implementation. It includes containerization, MongoDB persistence, reverse proxying, and Kubernetes deployment manifests, plus deployment documentation for the production architecture narrative.
