import { AppConfig } from '@infrastructure/config/AppConfig';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Swagger configuration for API documentation
 * Automatically scans route files for JSDoc comments
 */
export class SwaggerConfig {
  protected appConfig: AppConfig;

  constructor(appConfig: AppConfig) {
    this.appConfig = appConfig;
  }

  /**
   * Generate Swagger specification based on JSDoc comments in route files
   */
  public getSwaggerSpec(): object {
    const options: swaggerJSDoc.Options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'API Partners - Mesa de Pagos',
          version: '1.0.0',
          description: `
            API Partners built with TypeScript, Express and Hexagonal Architecture.

            This API provides three main services:
            - **Authentication**: User login and session management
            - **Transactions**: Deposit and withdrawal operations
            - **Partners**: Partner callback processing and integration
            
            ## Authentication
            Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
            \`Authorization: Bearer <your-jwt-token>\`
            
            ## Partner Callbacks
            The Partners API provides endpoints for processing callbacks from external partner systems.
            Each callback is authenticated, processed according to its operation type, and recorded for audit purposes.
            
            ## Error Handling
            All endpoints follow standard HTTP status codes:
            - **200-299**: Success responses
            - **400-499**: Client errors (validation, authentication, etc.)
            - **500-599**: Server errors
          `,
          contact: {
            name: 'API Partner Team',
            email: 'dev@mesa-pago.com'
          },
          license: {
            name: 'Private License',
            url: 'https://mesa-pago.com/license'
          }
        },
        servers: [
          {
            url: this.appConfig.isDevelopment()
              ? `http://localhost:${this.appConfig.getPort()}/api`
              : 'https://api-partner-rv72.onrender.com/api',
            description: this.appConfig.isDevelopment()
              ? 'Development server'
              : 'Production server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: `JWT token for authentication. 

Steps to authenticate:
1. Execute POST /auth/login with valid credentials
2. Copy the 'token' value from the 200 response
3. Click the 'Authorize' button (🔒) in this documentation
4. Paste the token (without 'Bearer' prefix) in the 'Value' field
5. Click 'Authorize' to apply the token to all protected endpoints

The token will be automatically included in the Authorization header as: Bearer <your-token>`
            }
          }
          // Schemas are now defined in separate files under src/infrastructure/docs/swagger/components/
        },
        // Define security requirement for protected endpoints
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      apis: [
        // Scan dedicated Swagger documentation files
        './src/infrastructure/docs/swagger/**/*.js',
        './src/infrastructure/docs/swagger/**/*.ts',
        // Include compiled JS files for production
        './dist/infrastructure/docs/swagger/**/*.js',
      ],
    };

    return swaggerJSDoc(options);
  }

  /**
   * Get Swagger UI options
   */
  public getSwaggerUIOptions(): object {
    return {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info h1 { color: #1f2937 }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
        .swagger-ui .auth-wrapper { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .swagger-ui .auth-wrapper .auth-container { margin: 0; }
        .swagger-ui .auth-wrapper .auth-container h4 { color: #0c4a6e; margin-bottom: 10px; }
        .swagger-ui .btn.authorize { background: #0ea5e9; border-color: #0ea5e9; }
        .swagger-ui .btn.authorize:hover { background: #0284c7; border-color: #0284c7; }
      `,
      customSiteTitle: 'API Partner Documentation - Mesa Pago',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        requestInterceptor: function (request: any) {
          // Log request details for debugging
          console.log('API Request:', request.method, request.url);
          return request;
        },
        responseInterceptor: function (response: any) {
          // Log response for debugging
          console.log('API Response:', response.status, response.url);
          return response;
        }
      }
    };
  }
}
