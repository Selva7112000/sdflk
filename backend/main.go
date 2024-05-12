package main

import (
	"fmt"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CacheItem struct {
	Value      interface{}
	Expiration time.Time
}

type LRUCache struct {
	items    map[string]CacheItem
	capacity int
	mutex    sync.Mutex
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		items:    make(map[string]CacheItem),
		capacity: capacity,
	}
}

func (c *LRUCache) Get(key string) (interface{}, bool) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	item, exists := c.items[key]
	if !exists {
		return nil, false
	}

	if time.Now().After(item.Expiration) {
		delete(c.items, key)
		return nil, false
	}

	return item.Value, true
}

func (c *LRUCache) Set(key string, value interface{}, expiration time.Duration) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	if len(c.items) >= c.capacity {
		c.evictOldest()
	}

	c.items[key] = CacheItem{
		Value:      value,
		Expiration: time.Now().Add(expiration),
	}
}

func (c *LRUCache) evictOldest() {
	var oldestKey string
	var oldestExpiration time.Time

	for key, item := range c.items {
		if oldestExpiration.IsZero() || item.Expiration.Before(oldestExpiration) {
			oldestKey = key
			oldestExpiration = item.Expiration
		}
	}

	delete(c.items, oldestKey)
}

func main() {
	fmt.Println("Server is running on port 8080")
	cache := NewLRUCache(1024)
	router := gin.Default()

	router.Use(cors.Default())

	router.POST("/set/:key", func(c *gin.Context) {
		key := c.Param("key")
		var json struct {
			Value      string `json:"value"`
			Expiration int64  `json:"expiration"`
		}
		if err := c.BindJSON(&json); err != nil {
			c.JSON(400, gin.H{"error": "Invalid JSON"})
			return
		}
		cache.Set(key, json.Value, time.Duration(json.Expiration)*time.Second)
		c.JSON(200, gin.H{"message": "Key set successfully"})
	})

	router.GET("/get/:key", func(c *gin.Context) {
		key := c.Param("key")
		if value, ok := cache.Get(key); ok {
			c.JSON(200, gin.H{"value": value})
		} else {
			c.JSON(404, gin.H{"error": "Key not found"})
		}
	})

	router.DELETE("/delete/:key", func(c *gin.Context) {
		key := c.Param("key")
		if _, ok := cache.Get(key); ok {
			delete(cache.items, key)
			c.JSON(200, gin.H{"message": "Key deleted successfully"})
		} else {
			c.JSON(404, gin.H{"error": "Key not found"})
		}
	})

	router.Run(":8080")
}
