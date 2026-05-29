# Agents.md - Instructions for AI Agents

This file provides guidance for AI agents working on the Gradle Install Manager (gim) project. It covers useful commands, technologies, best practices, and guidelines to ensure consistent, high-quality contributions.

## Project Overview

Gradle Install Manager (gim) is a CLI tool written in TypeScript using the Bun runtime that helps developers manage multiple Gradle versions on their system. It allows installing, listing, checking for updates, and verifying installed Gradle versions.

## Useful Commands

### Development Commands

```bash
# Start the application in development mode (with file watching)
bun run dev

# Build the application for production
bun run build

# Watch for changes and rebuild automatically
bun run build:watch

# Run the application directly
bun run start

# Format code with Prettier
bun run format

# Lint code with ESLint
bun run lint

# Fix linting errors automatically
bun run lint:fix

# Type-check TypeScript code
bun run typecheck
```

### Project Commands (via the gim CLI)

Once built/installed, the gim CLI provides these commands:

```bash
# Show help information
gim help

# Install a specific Gradle version
gim install <version>
gim install latest  # Installs the latest available version

# List all installed Gradle versions
gim list

# Check for newer Gradle versions
gim update

# Check current installed vs latest available versions
gim checkversion
```

### Testing Commands

```bash
# Run tests (if test framework is added)
# bun test
```

## Technologies

### Runtime & Package Manager

- **Bun**: Fast JavaScript/TypeScript runtime and package manager
  - Used for running, building, and managing dependencies
  - Provides native TypeScript support and fast execution

### Programming Language

- **TypeScript**: Strictly typed superset of JavaScript
  - All source code is written in TypeScript (.ts files)
  - Provides type safety and improved developer experience

### Build System

- **Bun Build**: Native Bun bundler
  - Used to create production-ready binary executables
  - Configured in package.json build scripts

### Dependencies

- **External**: Minimal external dependencies
  - Core functionality uses built-in Node.js APIs (fs, path) via Bun
  - HTTP requests use native `fetch` API
  - Shell commands use Bun's `$` utility for process execution

### Platform Support

- **Cross-platform**: Windows, macOS, Linux
  - Special handling for Windows (PowerShell for archive extraction)
  - Uses platform-appropriate commands where necessary

## Best Practices

### Code Organization

1. **Single Responsibility**: Each function should have one clear purpose
2. **Modularity**: Separate concerns (data fetching, installation, CLI handling)
3. **Constants**: Define constants at the top of files for easy configuration
4. **Error Handling**: Always handle promises and potential errors gracefully
5. **Logging**: Provide clear console output for user feedback

### TypeScript Practices

1. **Strict Typing**: Enable strict TypeScript options in tsconfig.json
2. **Interfaces**: Use interfaces for object shapes when beneficial
3. **Return Types**: Explicitly define return types for functions
4. **Avoid any**: Minimize use of `any` type; prefer specific types or generics
5. **Constants**: Use `const` for values that won't change, `let` for those that will

### CLI Design

1. **Clear Commands**: Use intuitive command names and aliases
2. **Help Documentation**: Provide comprehensive help text with examples
3. **Version Management**: Handle version strings properly (semver-aware where possible)
4. **Path Handling**: Use cross-platform path handling (path.join)
5. **User Feedback**: Provide progress indicators and clear success/error messages

### Security Considerations

1. **Input Validation**: Validate user input (especially version numbers)
2. **Secure Downloads**: Verify HTTPS connections when downloading distributions
3. **Path Safety**: Be cautious with file system operations to prevent path traversal
4. **Least Privilege**: Only request necessary permissions

### Performance

1. **Async/Await**: Use asynchronous operations for I/O-bound tasks
2. **Streaming**: Consider streaming for large file downloads (future improvement)
3. **Caching**: Consider caching version information to reduce API calls
4. **Cleanup**: Always clean up temporary files

## Guidelines

### Contributing

1. **Branching**: Create descriptive branches for features/fixes
2. **Commits**: Write clear, conventional commit messages
3. **Documentation**: Update README.md and other docs when changing functionality
4. **Testing**: Add tests for new functionality (when test framework is implemented)
5. **Code Review**: Participate in code review process

### Code Style

1. **Formatting**: Follow Prettier configuration (run `bun run format`)
2. **Linting**: Adhere to ESLint rules (run `bun run lint`)
3. **Naming**: Use descriptive names for variables, functions, and constants
4. **Comments**: Add comments for complex logic, not obvious code
5. **Line Length**: Keep lines reasonable length (prefer <100 characters)

### Error Handling

1. **User-Friendly Errors**: Provide actionable error messages
2. **Logging**: Log errors appropriately for debugging
3. **Graceful Degradation**: Provide fallbacks when possible (e.g., version fallback)
4. **Process Exit**: Use appropriate exit codes (0 for success, non-zero for errors)

### Cross-Platform Compatibility

1. **Path Handling**: Always use `path.join()` or `path.resolve()` for file paths
2. **Platform Detection**: Use `process.platform` to handle OS-specific logic
3. **Commands**: Use platform-appropriate commands or libraries
4. **Testing**: Test on Windows, macOS, and Linux when possible

### Maintenance

1. **Dependencies**: Keep dependencies updated and audited
2. **Documentation**: Keep documentation in sync with code changes
3. **Deprecation**: Clearly mark deprecated functionality
4. **Backward Compatibility**: Maintain backward compatibility where reasonable

## Project Structure

```
gradle-install-manager/
├── src/
│   ├── index.ts          # Main entry point and CLI logic
│   └── data/             # Data files (constants, etc.)
├── dist/                 # Built output directory
├── package.json          # Project metadata and scripts
├── bun.lock              # Bun lockfile
├── tsconfig.json         # TypeScript configuration
├── eslint.config.ts      # ESLint configuration
├── .prettierignore       # Prettier ignore patterns
├── .gitignore            # Git ignore patterns
└── Agents.md             # This file
```

## Future Improvements

Consider these areas for future development:

1. **Testing Framework**: Add unit/integration tests (e.g., with Vitest or Bun test)
2. **Version Validation**: Improve version comparison logic (semver library)
3. **Security**: Add checksum verification for downloaded distributions
4. **Caching**: Cache GitHub API responses to reduce rate limiting
5. **Configuration**: Allow users to customize install directory
6. **Shell Integration**: Add shell completion scripts (bash, zsh, fish)
7. **Packaging**: Create platform-specific installers (MSI, Homebrew, etc.)
8. **GUI**: Consider a simple GUI wrapper for less technical users

## Troubleshooting

Common issues and solutions:

1. **"Command not found" after installation**: 
   - Ensure the gradle bin directory is in your PATH
   - Run `gim install <version>` and follow the PATH instruction in output

2. **Download failures**:
   - Check internet connectivity
   - Verify GitHub API accessibility
   - Try again later if rate limited

3. **Extraction failures**:
   - Ensure sufficient disk space
   - Verify write permissions to target directory
   - On Windows, ensure PowerShell execution policy allows scripts

4. **Permission errors**:
   - Run with appropriate privileges for installation directory
   - Check file system permissions on target directories

## Getting Help

If you need assistance while working on this project:

1. **Check the source code**: Refer to src/index.ts for implementation details
2. **Run with help**: Use `gim help` to see available commands
3. **Review issues**: Check GitHub issues for known problems and feature requests
4. **Consult documentation**: Refer to this file and any future documentation

--- 
*Last updated: $(Get-Date -Format yyyy-MM-dd)*