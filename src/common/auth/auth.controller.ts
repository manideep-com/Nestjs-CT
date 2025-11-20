import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest-token')
  @ApiOperation({ 
    summary: 'Create guest token',
    description: 'Generate an anonymous guest token for unauthenticated users. This token allows browsing products and managing cart without user registration.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Guest token created successfully',
    schema: {
      example: {
        success: true,
        message: 'Guest token created successfully',
        data: {
          token: 'NW35rfPFRpR9gM41SyvqOItmxWMZxdHo',
          tokenType: 'Bearer',
          expiresIn: 172800,
          scope: 'view_products:n8n-ct-integration manage_my_profile:n8n-ct-integration manage_my_orders:n8n-ct-integration'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Failed to create guest token' })
  async createGuestToken() {
    const tokenData = await this.authService.createGuestToken();
    
    return {
      success: true,
      message: 'Guest token created successfully',
      data: {
        token: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        scope: tokenData.scope,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Verify token',
    description: 'Check if the provided Bearer token is valid and not expired. Requires Authorization header with Bearer token.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid',
    schema: {
      example: {
        success: true,
        message: 'Token is valid',
        data: {
          token: 'NW35rfPFRpR9gM41Sy...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-11-19T07:49:07.869Z',
        path: '/auth/verify',
        message: 'Authorization header is required'
      }
    }
  })
  async verifyToken(@Request() req: any) {  
    return {
      success: true,
      message: 'Token is valid',
      data: {
        token: req.token?.substring(0, 20) + '...', 
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Refresh token',
    description: 'Generate a new guest token and invalidate the old one. Requires valid Bearer token in Authorization header.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Token refreshed successfully',
    schema: {
      example: {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: 'NewTokenHere123456',
          tokenType: 'Bearer',
          expiresIn: 172800
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async refreshToken(@Request() req: any) { 
    const oldToken = req.token;
    const newTokenData = await this.authService.refreshGuestToken(oldToken);

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newTokenData.access_token,
        tokenType: newTokenData.token_type,
        expiresIn: newTokenData.expires_in,
      },
    };
  }
}