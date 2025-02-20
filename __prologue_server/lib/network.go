/* */

package lib

import (
	"net/http"
	"strings"
)

func GetIP(r *http.Request) string {
	headers := []string{
		"X-Forwarded-For",
		"X-Real-IP",
		"CF-Connecting-IP",
	}
	for _, header := range headers {
		ips := r.Header.Get(header)
		if ips != "" {
			return strings.TrimSpace(strings.Split(ips, ",")[0])
		}
	}
	ip := r.RemoteAddr
	colon := strings.LastIndex(ip, ":")
	if colon != -1 {
		ip = ip[:colon]
	}
	return strings.TrimSpace(ip)
}
