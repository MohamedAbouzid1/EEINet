# EEINet: The Exon-Exon Interactions Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org/)

## Overview

EEINet is a comprehensive web application and RESTful API for exploring human exon-exon interactions (EEIs) based on protein complex structures. The platform integrates structural data from protein complexes with computational analysis to provide insights into functional relationships between protein exons.

This tool serves as a valuable resource for researchers studying protein interactions, structural biology, and functional genomics by providing access to over 72,000 exon-exon interactions derived from multiple detection methods.

### Key Features

- **🔍 Comprehensive Database**: Over 72,000 exon-exon interactions from multiple detection methods
- **🧬 Multiple Detection Methods**: Contact-based, PISA, EPPIC, and Orthology-based predictions
- **💻 Interactive Web Interface**: Modern React-based frontend with advanced search and visualization
- **⏩ RESTful API**: Complete API for programmatic access to interaction data
- **📊 Data Export**: Multiple format support (JSON, CSV, TSV) with filtering options
- **⚡ Performance Optimized**: Rate limiting, caching, and efficient pagination
- **🔒 Secure**: Input validation, SQL injection prevention, and security headers

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** 15+ database
- **Express middleware**: CORS, rate limiting, compression, helmet security
- **Data validation** with express-validator

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for component library
- **React Query** for state management and caching
- **Framer Motion** for animations
- **Axios** for HTTP client

### Infrastructure
- **Docker** containerization
- **Nginx** reverse proxy
- **SSL/TLS** support
- **Health monitoring** and logging

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohamedAbouzid1/EEINet.git
   cd EEINet
   ```

2. **Backend setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

3. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb eei_network_db
   
   # Load schema
   psql -d eei_network_db -f schema.sql
   ```

4. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm start  # Development server on port 3000
   ```

5. **Start backend**
   ```bash
   cd ..
   npm run dev  # Development server on port 5000
   ```

### Docker Deployment

1. **Production deployment**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eei_network_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:8221
```

## API Documentation

### Base URLs
- **Development**: `http://localhost:5000/api`
- **Production**: `https://apps.cosy.bio/eeinet/api`

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Search endpoints**: 30 requests per minute
- **Export endpoints**: 10 requests per hour

### Core Endpoints

#### Health Check
```http
GET /health
```
Returns server health status and database connectivity.

#### Statistics
```http
GET /api/stats/summary
```
Returns database statistics including interaction counts and unique entities.

#### Search
```http
GET /api/search?q={query}&type={type}&limit={limit}&offset={offset}
```
Search for exons, proteins, or interactions.

#### Exon Interactions
```http
GET /api/exon/{exonId}/interactions
```
Get interactions for a specific exon.

#### Protein Information
```http
GET /api/protein/{proteinId}
GET /api/protein/{proteinId}/exons
GET /api/protein/{proteinId}/interactions
```
Retrieve protein details, exons, and interactions.

#### Data Export
```http
GET /api/export/interactions?format={json|csv|tsv}&filters={...}
```
Export interaction data in various formats.

## Database Schema

The database follows a normalized relational design with the following core entities:

- **Organisms**: Species information (Human, Mouse, etc.)
- **Genes**: Gene information with genomic coordinates
- **Exons**: Exon details with Ensembl identifiers
- **Proteins**: UniProt protein information
- **EEI Interactions**: Core interaction data
- **Detection Methods**: Method metadata and configurations
- **Method-specific Attributes**: PISA, EPPIC, and orthology data

## Detection Methods

EEINet incorporates multiple computational approaches for detecting exon-exon interactions:

### 1. Contact-based Methods
Direct structural analysis of protein-protein contacts from crystal structures.

### 2. PISA (Protein Interfaces, Surfaces and Assemblies)
Analysis of protein quaternary structures and interface properties.

### 3. EPPIC (Evolutionary Protein-Protein Interface Classifier)
Evolutionary analysis to distinguish biological from crystal interfaces.

### 4. Orthology-based Predictions
Comparative analysis across species to identify conserved interactions.

Each method provides confidence scores and specific attributes to help users evaluate interaction reliability.

## Development

### Project Structure

```
├── app.js                 # Main application entry
├── controllers/           # Request handlers
├── models/               # Database models
├── routes/               # API route definitions
├── middleware/           # Custom middleware
├── errors/               # Error handling
├── utils/                # Utility functions
├── tests/                # Test suites
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   └── nginx.conf
├── docker-compose.yml    # Container orchestration
├── deploy.sh            # Deployment script
└── README.md
```

### Running Tests

```bash
# Backend tests
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
```

### Code Quality

The project follows best practices for:
- **Linting**: ESLint for JavaScript
- **Formatting**: Prettier for code style
- **Security**: Input validation, parameterized queries
- **Performance**: Query optimization, caching strategies

## Production Deployment

### Live Application
- **Frontend**: https://apps.cosy.bio/eeinet
- **API**: https://apps.cosy.bio/eeinet/api

### Docker Compose
The application is containerized with:
- **Backend**: Node.js Express server
- **Frontend**: React app with Nginx
- **Database**: PostgreSQL with persistent volumes
- **Reverse Proxy**: Nginx with SSL/TLS

## Contributing

We welcome contributions to EEINet! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Commit changes (`git commit -m 'Add amazing feature'`)
8. Push to branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Standards
- Follow existing code style and patterns
- Add appropriate tests for new features
- Update API documentation for endpoint changes
- Use conventional commit messages

### Commit Message Format
```
feat: add new detection method
fix: resolve search pagination issue
docs: update API documentation
test: add integration tests for export
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation

If you use EEINet in your research, please cite:

```
EEINet: A comprehensive database resource for human exon-exon interactions. 2025. Available at: https://apps.cosy.bio/eeinet/
```

## Support

### Contact Information
- **Primary Developer**: Mohamed Abouzid
- **Supervisor**: Dr. Khalique Newaz (NeStOme Lab)
- **Institution**: University of Hamburg, Institute for Computational Systems Biology

### Resources
- **GitHub Repository**: https://github.com/MohamedAbouzid1/EEINet
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: API reference and guides in the repository

## Acknowledgments

This project is developed at the University of Hamburg, Institute for Computational Systems Biology, under the supervision of Prof. Dr. Jan Baumbach and Dr. Khalique Newaz.

---

For the most current information and detailed documentation, please refer to the GitHub repository and inline code comments.
