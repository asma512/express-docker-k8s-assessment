# Express Docker & Kubernetes Assessment

This project is a lightweight Express API for managing books, packaged for Docker Compose and Kubernetes deployment. It includes MongoDB persistence, a simple React client, and deployment manifests for a Kind-based Kubernetes cluster.

## Features
- Express REST API with JWT auth and protected CRUD routes
- MongoDB persistence via Mongoose
- Dockerized backend service with health checks
- docker-compose.yml with MongoDB and API services
- Multi-stage React build served by Nginx
- Kubernetes Deployment and NodePort Service

## Prerequisites
- Node.js 20+
- npm
- Docker Desktop or Docker Engine
- kubectl
- kind (optional for local K8s validation)

## Local development
```bash
npm install
cp .env.example .env
npm run dev
```

The API will be available at http://localhost:3000.

## Docker Compose
```bash
docker compose up --build
```

This starts:
- Express API on http://localhost:3000
- MongoDB on localhost:27017

Available health endpoint:
```bash
curl http://localhost:3000/health
```

## Example API calls
```bash
curl http://localhost:3000/api/books
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"The Hobbit","author":"J.R.R. Tolkien","category":"Fantasy","price":15.99,"inStock":true}'
```

## Kubernetes (Kind)
```bash
kind create cluster --name book-cluster
kubectl apply -f k8s/
kubectl get pods
kubectl get svc
```

The app should be available via the NodePort service on port 30080.

## Notes
- Keep secrets out of the repository. Use environment variables or AWS Secrets Manager in production.
- The app is intentionally simple so it remains easy to review and validate in both Docker and Kubernetes environments.
