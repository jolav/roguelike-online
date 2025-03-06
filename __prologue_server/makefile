# Application name
APP := prologueNEW

# Output directory for compiled binaries
BIN_DIR := $(HOME)/Documentos/prologue/bin
# Directory to copy configuration files from
CONF_DIR := ./conf

# Current date and time in UTC format
DATE := $(shell date -u +%F_%T)

# Build flags
LDFLAGS := -ldflags "-X 'main.when=$(DATE)'"

# Default rule
all: $(APP) copy-config

# Rules to compile the application
$(APP):
	@mkdir -p $(BIN_DIR)
	rm -f $(BIN_DIR)/$@
	go build $(LDFLAGS) -o $(BIN_DIR)/$@ *.go
#   go build $(LDFLAGS) -o $(BIN_DIR)/$@ cmd/*.go

# Rule to copy configuration files
#copy-config:
#	@cp -r $(CONF_DIR) $(BIN_DIR)/
# Rule to copy configuration files
copy-config:
	@mkdir -p $(BIN_DIR)/$(CONF_DIR)
	@cp -r $(CONF_DIR)/* $(BIN_DIR)/$(CONF_DIR)/
	@mv $(BIN_DIR)/$(CONF_DIR)/conf_private.json $(BIN_DIR)/$(CONF_DIR)/conf.json


# Rule to clean compiled files
clean:
	@rm -rf $(BIN_DIR)/*

# Phony rules to avoid conflicts with existing files
.PHONY: all clean $(APP) copy-config

#####                                                                           chmod +x prologueNEW && mv prologueNEW prologue && systemctl --user restart PROLOGUE.service && systemctl --user status PROLOGUE.service

