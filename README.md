# 🚀 NestJS DDD CQRS Boilerplate

> Boilerplate moderne avec Clean Architecture, DDD, CQRS, Event Sourcing et microservices ready

## ✨ Améliorations apportées

- 🎯 **Event Sourcing** intégré
- 🔄 **Redis** pour cache et pub/sub
- 📊 **Monitoring** avec Prometheus/Grafana
- 🐳 **Docker** multi-stage optimisé
- 🧪 **Tests** complets (unit/integration/e2e)
- 📝 **Documentation** auto-générée
- 🔒 **Security** renforcée (rate limiting, CORS, helmet)
- 🌐 **i18n** support multilingue
- 📈 **Health checks** avancés
- 🔍 **Logging** structuré avec Winston

## 🏗️ Architecture

```
src/
├── @core/                    # Core framework (réutilisable)
│   ├── domain/              # Domain primitives
│   ├── application/         # CQRS base classes
│   ├── infrastructure/      # Infrastructure services
│   └── presentation/        # HTTP layer
├── modules/                 # Business modules
│   └── user/               # Example module
│       ├── domain/         # Entities, Value Objects, Events
│       ├── application/    # Commands, Queries, Handlers
│       ├── infrastructure/ # Repositories, External services
│       └── presentation/   # Controllers, DTOs
├── shared/                 # Shared utilities
└── config/                # Configuration
```

## 🚀 Quick Start

```bash
# Installation
npm install

# Setup environment
cp .env.example .env

# Start dependencies
docker-compose up -d

# Run migrations
npm run migration:run

# Start development
npm run start:dev
```

## 📦 Technologies

- **NestJS** 10+ (Latest)
- **TypeScript** 5+
- **PostgreSQL** avec TypeORM
- **Redis** pour cache/sessions
- **Event Store** pour Event Sourcing
- **Docker** & Docker Compose
- **Jest** pour les tests
- **Swagger** documentation
- **Prometheus** monitoring
- **Winston** logging

## 🔧 Scripts

```bash
npm run start:dev         # Development
npm run build            # Build production
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npm run migration:generate # Generate migration
npm run seed             # Seed database
npm run docs:generate    # Generate docs
```

## 📊 Monitoring

- Health checks: `/health`
- Metrics: `/metrics`
- API docs: `/api/docs`

## 🔒 Security Features

- JWT Authentication
- Role-based authorization
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

## 🌐 Internationalization

Support multilingue avec i18n intégré.

## 📈 Performance

- Redis caching
- Database query optimization
- Response compression
- Connection pooling

## 🧪 Testing Strategy

- Unit tests pour la logique métier
- Integration tests pour les repositories
- E2E tests pour les APIs
- Coverage > 80%
