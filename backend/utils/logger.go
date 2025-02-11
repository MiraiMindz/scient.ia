package utils

import "go.uber.org/zap"

// This function setups the Logger
func SetupLogger() {
	config := zap.NewProductionConfig()
	config.OutputPaths = []string{"stdout"}
	tempLogger, err := config.Build()
	if err != nil {
		panic(err)
	}
	Logger = tempLogger
}
