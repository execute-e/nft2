package http

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const authHeader = "Authorization"

func AdminAuth(adminToken string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader(authHeader)
		if header == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			return
		}

		parts := strings.Split(header, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			return
		}

		if parts[1] != adminToken {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid admin token"})
			return
		}

		c.Next()
	}
}