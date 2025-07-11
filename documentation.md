# EEINet: Exon-Exon Interactions Database

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Detection Methods](#detection-methods)
7. [Frontend Application](#frontend-application)
8. [Deployment](#deployment)
9. [Development Guide](#development-guide)
10. [Contributing](#contributing)

## Overview

EEINet is a comprehensive web application and API for exploring human exon-exon interactions (EEIs) based on protein complex structures. The platform integrates structural data from protein complexes with computational orthology analysis to provide insights into functional relationships between protein exons.

### Key Features

- **Comprehensive Database**: Over 72,000 exon-exon interactions from multiple detection methods
- **Multiple Detection Methods**: Contact-based, PISA, EPPIC, and orthology-based predictions
- **Interactive Web Interface**: Modern React-based frontend with advanced search and visualization
- **RESTful API**: Complete API for programmatic access to interaction data
- **Network Visualization**: Interactive network graphs for exploring interaction patterns
- **Data Export**: Multiple format support (JSON, CSV, TSV) with filtering options

### Technology Stack

**Backend:**
- Node.js with Express.js
- PostgreSQL database
- Rate limiting and CORS middleware
- Data validation with express-validator

**Frontend:**
- React 19 with TypeScript
- Material-UI (MUI) for components
- Cytoscape.js for network visualization
- React Query for state management
- Framer Motion for animations

**Infrastructure:**
- Docker containerization
- Nginx reverse proxy
- SSL/TLS support
- Health monitoring

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React SPA)   │◄──►│   (Node.js)     │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Nginx Proxy   │    │   Rate Limiting │    │   Data Loading  │
│   Load Balancer │    │   CORS Handler  │    │   Functions     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Design

The database follows a normalized relational design with the following core entities:

- **Organisms**: Species information (Human, Mouse)
- **Genes**: Gene information with genomic coordinates
- **Exons**: Exon details with Ensembl identifiers
- **Proteins**: UniProt protein information
- **EEI Interactions**: Core interaction data
- **Detection Methods**: Method metadata and configurations
- **Method-specific Attributes**: PISA, EPPIC, and orthology data

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- Git

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MohamedAbouzid1/EEINet.git
   cd EEINet
   ```

2. **Backend Setup**
   ```bash
   # Install backend dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb eei_network_db
   
   # Load schema
   psql -d eei_network_db -f schema.sql
   
   # Load data (if available)
   # psql -d eei_network_db -f data.sql
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start  # Development server on port 3000
   ```

5. **Start Backend**
   ```bash
   cd ..
   npm run dev  # Development server on port 5000
   ```

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

### Docker Deployment

1. **Create Production Environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://prototypes.cosy.bio/eeinet/api`

### Authentication
Currently, no authentication is required. Rate limiting is applied:
- General API: 100 requests per 15 minutes
- Search: 30 requests per minute
- Export: 10 requests per hour

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

#### Exon Endpoints

##### Get Exon Details
```http
GET /api/exon/{exon_id}
```
- **Parameters**: `exon_id` - Ensembl exon ID or numeric ID
- **Response**: Exon information including gene mapping and genomic coordinates

##### Get Exon Interactions
```http
GET /api/exon/{exon_id}/interactions
```
- **Parameters**: 
  - `exon_id` - Exon identifier
  - `limit` (optional) - Results per page (default: 50, max: 1000)
  - `offset` (optional) - Pagination offset (default: 0)
  - `method` (optional) - Filter by detection method

#### Protein Endpoints

##### Get Protein Details
```http
GET /api/protein/{protein_id}
```
- **Parameters**: `protein_id` - UniProt ID or numeric ID
- **Response**: Protein information and associated gene data

##### Get Protein Interactions
```http
GET /api/protein/{protein_id}/interactions
```
Similar parameters to exon interactions endpoint.

#### Interaction Endpoints

##### Get Experimental Interactions
```http
GET /api/interactions/experimental
```
- **Parameters**:
  - `limit`, `offset` - Pagination
  - `method` - Filter by detection method
  - `min_jaccard` - Minimum Jaccard similarity threshold

##### Get Predicted Interactions
```http
GET /api/interactions/predicted
```
- **Parameters**:
  - `limit`, `offset` - Pagination
  - `method` - Filter by prediction method
  - `min_confidence` - Minimum confidence threshold

##### Get Interaction Details
```http
GET /api/interactions/{interaction_id}
```
Returns comprehensive interaction details including method-specific attributes.

#### Search Endpoints

##### General Search
```http
GET /api/search
```
- **Parameters**:
  - `q` - Search query (required)
  - `type` - Search type: 'gene', 'protein', 'exon', 'any' (default: 'any')
  - `limit`, `offset` - Pagination

##### Search Suggestions
```http
GET /api/search/suggestions
```
- **Parameters**:
  - `q` - Query string (min 2 characters)
  - `limit` - Max suggestions (default: 10)

#### Export Endpoints

##### Export Interactions
```http
GET /api/export/interactions
```
- **Parameters**:
  - `format` - Export format: 'json', 'csv', 'tsv' (default: 'json')
  - `type` - Data type: 'experimental', 'predicted', 'All' (default: 'experimental')
  - `method` - Filter by method
  - `limit` - Record limit or 'all' for complete export
  - `min_confidence`, `min_jaccard` - Quality thresholds

#### Network Endpoints

##### Gene Network
```http
GET /api/network/gene/{gene_symbol}
```
Returns interaction network for a specific gene.

##### Protein Network
```http
GET /api/network/protein/{protein_id}
```
Returns interaction network for a specific protein.

##### Network Subgraph
```http
GET /api/network/interactions/subgraph
```
- **Parameters**:
  - `genes`, `proteins`, `exons` - Comma-separated lists
  - `method_filter`, `min_confidence`, `min_jaccard` - Filters
  - `max_interactions` - Maximum interactions to return

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {  // For paginated endpoints
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Descriptive error message"
}
```

## Database Schema

### Core Tables

#### Organisms
```sql
organisms (
  organism_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  scientific_name VARCHAR(200),
  taxonomy_id INTEGER
)
```

#### Genes
```sql
genes (
  gene_id SERIAL PRIMARY KEY,
  gene_symbol VARCHAR(50) NOT NULL,
  gene_name VARCHAR(255),
  organism_id INTEGER REFERENCES organisms(organism_id),
  chromosome VARCHAR(20),
  strand CHAR(1),
  gene_start BIGINT,
  gene_end BIGINT,
  ensembl_gene_id VARCHAR(50)
)
```

#### Exons
```sql
exons (
  exon_id SERIAL PRIMARY KEY,
  ensembl_exon_id VARCHAR(50) UNIQUE NOT NULL,
  gene_id INTEGER REFERENCES genes(gene_id),
  exon_number INTEGER,
  chromosome VARCHAR(20),
  strand CHAR(1),
  exon_start BIGINT,
  exon_end BIGINT,
  exon_length INTEGER,
  sequence TEXT
)
```

#### Proteins
```sql
proteins (
  protein_id SERIAL PRIMARY KEY,
  uniprot_id VARCHAR(50) UNIQUE NOT NULL,
  protein_name VARCHAR(255),
  gene_id INTEGER REFERENCES genes(gene_id),
  sequence_length INTEGER,
  molecular_weight NUMERIC(10,3),
  description TEXT
)
```

#### EEI Interactions
```sql
eei_interactions (
  eei_id SERIAL PRIMARY KEY,
  exon1_id INTEGER REFERENCES exons(exon_id),
  exon2_id INTEGER REFERENCES exons(exon_id),
  protein1_id INTEGER REFERENCES proteins(protein_id),
  protein2_id INTEGER REFERENCES proteins(protein_id),
  method_id INTEGER REFERENCES eei_methods(method_id),
  pdb_id VARCHAR(10) REFERENCES pdb_structures(pdb_id),
  jaccard_percent NUMERIC(5,2),
  aa1 INTEGER,
  aa2 INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exon1_id, exon2_id, method_id, pdb_id)
)
```

### Method-Specific Tables

#### PISA Attributes
```sql
eei_pisa_attributes (
  eei_id INTEGER PRIMARY KEY REFERENCES eei_interactions(eei_id),
  free_energy NUMERIC(10,6),
  buried_area NUMERIC(12,6),
  hydrogen_bonds INTEGER,
  salt_bridges INTEGER
)
```

#### EPPIC Attributes
```sql
eei_eppic_attributes (
  eei_id INTEGER PRIMARY KEY REFERENCES eei_interactions(eei_id),
  cs_score NUMERIC(8,3),
  cr_score NUMERIC(8,3),
  buried_area_abs NUMERIC(10,3)
)
```

#### Orthology Mapping
```sql
eei_orthology_mapping (
  eei_id INTEGER PRIMARY KEY REFERENCES eei_interactions(eei_id),
  source_organism_id INTEGER REFERENCES organisms(organism_id),
  confidence NUMERIC(15,13),
  identity1 NUMERIC(4,3),
  identity2 NUMERIC(4,3),
  mouse_exon1_coordinates VARCHAR(100),
  mouse_exon2_coordinates VARCHAR(100)
)
```

### Database Functions

#### Search Function
```sql
search_eei_interactions(
  search_term VARCHAR,
  search_type VARCHAR DEFAULT 'any',
  result_limit INTEGER DEFAULT 50,
  result_offset INTEGER DEFAULT 0
)
```

#### Statistics Function
```sql
get_eei_statistics() RETURNS TABLE(metric VARCHAR, value BIGINT)
```

#### Export Function
```sql
export_eei_by_method(method_name_param VARCHAR)
```

#### Network Functions
```sql
get_gene_eei_network(gene_symbol_param VARCHAR, max_interactions INTEGER)
```

## Detection Methods

### 1. Contact-Based Detection

**Principle**: Direct structural analysis using atomic coordinates from PDB structures.

**Implementation**:
- Distance threshold: 6 Å between heavy atoms
- Identifies direct physical contacts between exon-encoded regions
- High accuracy for resolved structures

**Quality Metrics**:
- Jaccard similarity percentage
- Coverage statistics for each exon

**Use Cases**:
- High-confidence interaction identification
- Structural validation of predictions
- Drug target analysis

### 2. PISA-Based Detection

**Principle**: Protein Interfaces, Surfaces and Assemblies - thermodynamic analysis.

**Implementation**:
- Calculates solvation free energy upon complex formation
- Distinguishes biological interfaces from crystal contacts
- Statistical significance testing

**Quality Metrics**:
- Free energy (kcal/mol)
- Buried surface area (Ų)
- Hydrogen bonds and salt bridges count

**Thresholds**:
- P-value < 0.5 for biological relevance
- Minimum buried area considerations

### 3. EPPIC-Based Detection

**Principle**: Evolutionary Protein-Protein Interface Classifier.

**Implementation**:
- Combines structural analysis with evolutionary conservation
- Uses multiple sequence alignments for scoring
- Two-tiered classification system

**Quality Metrics**:
- CS Score (Core-Surface conservation)
- CR Score (Core-Rim conservation)
- Surface area thresholds

**Classification Rules**:
- Large interfaces (>2200 Ų): Biological
- Small interfaces (<440 Ų): Crystal contacts
- Medium interfaces: Evolutionary analysis required

### 4. Orthology-Based Predictions

**Principle**: Cross-species interaction prediction using EGIO analysis.

**Implementation**:
- Maps mouse structural interactions to human sequences
- Uses evolutionary conservation principles
- Quality assessment through sequence identity

**Quality Metrics**:
- Confidence score (0-1)
- Sequence identity percentages
- Coverage statistics

**EGIO Algorithm**:
- Exon Group Ideogram-based orthology detection
- Minimum 80% sequence identity requirement
- Dynamic programming for optimal alignment

## Frontend Application

### Architecture

The frontend is a modern React Single Page Application (SPA) with the following structure:

```
frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   └── App.js
├── public/
└── package.json
```

### Key Components

#### Layout Components
- **Navbar**: Primary navigation with responsive design
- **Footer**: Contact information and links

#### Page Components
- **HomePage**: Landing page with search and statistics
- **SearchPage**: Advanced search with filters and autocomplete
- **ExonDetailsPage**: Detailed exon information and interactions
- **ProteinDetailsPage**: Protein details with associated exons
- **InteractionDetailsPage**: Comprehensive interaction data
- **StatisticsPage**: Database analytics and distributions
- **NetworkVisualizationPage**: Interactive network graphs
- **ExportPage**: Data export with filtering options
- **Method Pages**: Detailed explanations of detection methods

#### Features

##### Search Functionality
- Real-time autocomplete suggestions
- Multiple search types (gene, protein, exon, any)
- Advanced filtering options
- Paginated results with sorting

##### Data Export
- Multiple format support (JSON, CSV, TSV)
- Quality threshold filtering
- Method-specific exports
- Batch processing for large datasets

##### Responsive Design
- Mobile-first approach
- Material-UI components
- Accessibility compliance

### State Management

- **React Query**: Server state management and caching
- **React Hooks**: Local component state
- **Context API**: Global application state

### Styling

- **Material-UI (MUI)**: Component library
- **Custom Theme**: Branded color scheme and typography
- **Responsive Breakpoints**: Mobile, tablet, desktop support
- **CSS-in-JS**: Styled components with theme integration

## Deployment

### Production Environment

#### Docker Compose Setup

The application uses a multi-container Docker setup:

```yaml
version: '3.8'
services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "8223:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    environment:
      NODE_ENV: production
      DB_HOST: database
    ports:
      - "5000:5000"
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "8221:8080"
    depends_on:
      - backend
```

#### Nginx Configuration

The frontend container includes Nginx with:
- Reverse proxy for API requests
- Static file serving
- SSL/TLS termination
- GZIP compression
- Security headers

#### Deployment Script

Use the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script handles:
- Environment validation
- Container orchestration
- Database backups
- Health checks
- Log management

### Production URLs

- **Frontend**: https://prototypes.cosy.bio/eeinet
- **API**: https://prototypes.cosy.bio/eeinet/api
- **Health Check**: https://prototypes.cosy.bio/eeinet/api/health

### Monitoring and Logging

#### Health Checks
- Database connectivity verification
- Service availability monitoring
- Resource usage tracking

#### Logging
- Structured JSON logging
- Error tracking and alerting
- Performance metrics collection

#### Backup Strategy
- Automated database backups
- Container volume persistence
- Configuration versioning

## Development Guide

### Code Organization

#### Backend Structure
```
├── app.js                 # Main application entry
├── controllers/           # Request handlers
├── models/               # Database models
├── routes/               # API route definitions
├── middleware/           # Custom middleware
├── errors/               # Error handling
├── utils/                # Utility functions
└── tests/                # Test suites
```

#### API Design Patterns

1. **RESTful Routes**: Standard HTTP verbs and resource naming
2. **Middleware Chain**: Authentication, validation, rate limiting
3. **Error Handling**: Centralized error processing
4. **Data Validation**: Express-validator for input validation
5. **Database Access**: Parameterized queries for security

#### Frontend Patterns

1. **Component Composition**: Reusable, single-responsibility components
2. **Custom Hooks**: Shared logic extraction
3. **Service Layer**: API communication abstraction
4. **Error Boundaries**: Graceful error handling
5. **Performance Optimization**: Lazy loading, memoization

### Testing Strategy

#### Backend Testing
```bash
# Run test suite
npm test

# Coverage report
npm run test:coverage
```

Test categories:
- Unit tests for models and utilities
- Integration tests for API endpoints
- Database function testing
- Error handling validation

#### Frontend Testing
```bash
cd frontend
npm test
```

Test types:
- Component rendering tests
- User interaction simulation
- API integration testing
- Accessibility compliance

### Code Quality

#### Linting and Formatting
- ESLint for JavaScript linting
- Prettier for code formatting
- Pre-commit hooks for quality gates

#### Security Practices
- Input validation and sanitization
- SQL injection prevention
- Rate limiting and CORS protection
- Environment variable management

#### Performance Guidelines
- Database query optimization
- Efficient pagination implementation
- Caching strategies
- Bundle size optimization

### Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   # Develop feature
   npm test
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Code Review Process**
   - Pull request creation
   - Automated testing
   - Manual code review
   - Documentation updates

3. **Deployment Process**
   - Merge to main branch
   - Automated testing
   - Production deployment
   - Health monitoring

## Contributing

### Getting Started

1. **Fork the Repository**
2. **Clone Your Fork**
   ```bash
   git clone https://github.com/yourusername/EEINet.git
   ```
3. **Set Up Development Environment**
   - Follow installation instructions
   - Create feature branch
   - Make changes
   - Add tests
   - Submit pull request

### Contribution Guidelines

#### Code Standards
- Follow existing code style and patterns
- Add appropriate tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting

#### Commit Messages
Use conventional commit format:
```
feat: add new detection method
fix: resolve search pagination issue
docs: update API documentation
test: add integration tests for export
```

#### Pull Request Process
1. Create descriptive PR title and description
2. Link related issues
3. Ensure CI passes
4. Request review from maintainers
5. Address feedback promptly

### Development Support

#### Contact Information
- **Primary Developer**: Mohamed Abouzid
- **Supervisor**: Dr. Khalique Newaz (NeStOme Lab)
- **Institution**: University of Hamburg, Institute for Computational Systems Biology

#### Resources
- **GitHub Repository**: https://github.com/MohamedAbouzid1/EEINet
- **Issues**: Report bugs and feature requests
- **Discussions**: Community support and questions
- **Documentation**: API reference and guides

#### License
This project is licensed under the MIT License. See the LICENSE file for details.

---

*This documentation is maintained alongside the codebase. For the most current information, please refer to the GitHub repository and inline code comments.*