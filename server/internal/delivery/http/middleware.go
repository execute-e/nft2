package http

import (
	"crypto/subtle"
	"net/http"
	"os"
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

func BasicAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, pass, hasAuth := c.Request.BasicAuth()

		expectedUser := os.Getenv("BASIC_AUTH_USERNAME")
		expectedPass := os.Getenv("BASIC_AUTH_PASSWORD")

		// чтобы избежать timing attacks
		userMatch := (subtle.ConstantTimeCompare([]byte(user), []byte(expectedUser)) == 1)
		passMatch := (subtle.ConstantTimeCompare([]byte(pass), []byte(expectedPass)) == 1)

		if hasAuth && userMatch && passMatch {
			c.Next()
		} else {
			c.Header("WWW-Authenticate", `Basic realm="Restricted"`)
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	}
}