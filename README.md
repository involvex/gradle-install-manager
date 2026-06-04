# Gradle Install Manager (gim)

A CLI tool written in TypeScript using the Bun runtime that helps developers manage multiple Gradle versions on their system.

## Features

- Install specific Gradle versions
- Install the latest available Gradle version
- List all installed Gradle versions
- Check for newer Gradle versions
- Check current installed vs latest available versions

## Installation

### Prerequisites

- [Bun](https://bun.sh) runtime installed
- Internet connectivity for downloading Gradle distributions

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/gradle-install-manager.git
   cd gradle-install-manager
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the application:

   ```bash
   bun run build
   ```

4. (Optional) Install globally for easy access:
   ```bash
   bun run build && bun link
   ```

## Usage

Once installed, you can use the `gim` command:

```bash
# Show help information
gim help

# Install a specific Gradle version
gim install 8.5

# Install the latest available Gradle version
gim install latest

# List all installed Gradle versions
gim list

# Check for newer Gradle versions
gim update

# Check current installed vs latest available versions
gim checkversion
```

## How It Works

Gradle Install Manager:

1. Downloads Gradle distributions from the official Gradle distributions URL
2. Extracts them to `~/.gradle/bin/` (or `%USERPROFILE%\.gradle\bin\` on Windows)
3. Manages version-specific directories for easy PATH configuration
4. Provides helpful output guiding users to add the Gradle bin directory to their PATH

## Project Structure

```
gradle-install-manager/
├── src/
│   ├── index.ts          # Main entry point and CLI logic
│   └── data/             # Data files (constants)
├── dist/                 # Built output directory
├── package.json          # Project metadata and scripts
├── bun.lock              # Bun lockfile
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Development Commands

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

## Platform Support

Gradle Install Manager supports:

- Windows (using PowerShell for archive extraction)
- macOS
- Linux

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
