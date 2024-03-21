import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    apiFolder: 'pages/api',
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BrowserStack Demo API',
            version: '1.0.0',
        },
        tags: [
            {
                name: "Movies"
            },
            {
                name: "Comments"
            }
        ],
        components: {
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: {
                            type: "integer",
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        },
    },
});

export default swaggerHandler();