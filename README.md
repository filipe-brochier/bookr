# Bookr

This project demonstrates the implementation of a scalable backend using NestJS microservices architecture, focusing on robustness, maintainability, and cloud deployment.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Introduction

This project utilizes NestJS to develop a suite of microservices that encompass user authentication, payment processing, and notification systems. It aims to provide a resilient backend capable of handling various business operations efficiently.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [Microservices Architecture](https://microservices.io/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Google Cloud](https://cloud.google.com/)
- Additional libraries and tools necessary for development.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (24.12.0)
- npm (11.6.2) or pnpm (10.28.1)
- Docker
- Google Cloud SDK

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/filipe-brochier/bookr.git
    ```

2. Navigate to the project directory:
    ```bash
    cd bookr
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    pnpm install
    ```

4. Make sure to configure environment variables in the `.env` file.

5. Start the application:
    ```bash
    npm run start:dev
    ```
    or
    ```bash
    pnpm run start:dev
    ```

## Usage

This project exposes multiple APIs for each microservice. Refer to the documentation for API endpoints and request/response structures.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

## Contact

Filipe Brochier  
https://www.linkedin.com/in/filipe-brochier/