#!/usr/bin/env bun

import {existsSync, mkdirSync} from 'fs'
import {join} from 'path'
import {$} from 'bun'

// Import from our data file
import {GRADLE_DISTIBUTIONS_BASE_URL} from './data'

// Constants
const homeDir = process.env.HOME || process.env.USERPROFILE || ''
const gradleBinDir = join(homeDir, '.gradle', 'bin')

// Ensure the gradle bin directory exists
if (!existsSync(gradleBinDir)) {
	mkdirSync(gradleBinDir, {recursive: true})
}

/**
 * Fetches the latest Gradle version from GitHub releases
 */
async function getLatestGradleVersion(): Promise<string> {
	try {
		// GitHub API endpoint for latest release
		const response = await fetch(
			'https://api.github.com/repos/gradle/gradle/releases/latest',
		)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = (await response.json()) as {tag_name: string}
		// Extract version from tag_name (format: vX.X.X)
		const tagName = data.tag_name
		return tagName.startsWith('v') ? tagName.substring(1) : tagName
	} catch (error) {
		console.error('Error fetching latest Gradle version:', error)
		// Fallback to a known recent version
		return '8.5'
	}
}

/**
 * Downloads and extracts a Gradle distribution
 */
async function installGradleVersion(version: string): Promise<void> {
	try {
		console.log(`Installing Gradle version ${version}...`)

		const downloadUrl = `${GRADLE_DISTIBUTIONS_BASE_URL}gradle-${version}-bin.zip`
		const tempZipPath = join(
			process.env.TMPDIR || '/tmp',
			`gradle-${version}-bin.zip`,
		)
		const extractDir = join(gradleBinDir, `gradle-${version}`)

		// Download the Gradle distribution
		console.log(`Downloading from ${downloadUrl}...`)
		await $`curl -L -o "${tempZipPath}" "${downloadUrl}"`

		// Extract the zip file using PowerShell on Windows
		console.log(`Extracting to ${extractDir}...`)
		if (process.platform === 'win32') {
			// Use PowerShell's Expand-Archive on Windows
			await $`powershell -Command "Expand-Archive -Path '${tempZipPath}' -DestinationPath '${gradleBinDir}' -Force"`
		} else {
			// Use unzip on Unix-like systems
			await $`unzip -o "${tempZipPath}" -d "${gradleBinDir}"`
		}

		// Move extracted contents to version-specific directory if needed
		const extractedGradleDir = join(gradleBinDir, `gradle-${version}`)
		const possibleExtractedDir = join(gradleBinDir, `gradle-${version}`)
		if (
			existsSync(possibleExtractedDir) &&
			possibleExtractedDir !== extractedGradleDir
		) {
			// If the extraction created a nested directory, move contents up
			const items = await $`ls -A1 "${possibleExtractedDir}"`.text()
			for (const item of items.trim().split('\n').filter(Boolean)) {
				await $`mv "${join(possibleExtractedDir, item)}" "${extractedGradleDir}"`
			}
			// Remove the now empty directory
			await $`rmdir "${possibleExtractedDir}"`
		}

		// Make gradle executable
		const gradleBinPath = join(extractedGradleDir, 'bin', 'gradle.bat')
		if (existsSync(gradleBinPath)) {
			// On Windows, ensure it's executable
			try {
				await $`attrib +x "${gradleBinPath}"`
			} catch {
				// Ignore if attrib fails
			}
		}

		// Clean up temp file
		await $`rm -f "${tempZipPath}"`

		console.log(`Gradle ${version} installed successfully to ${extractDir}`)
		console.log(
			`Add ${join(extractedGradleDir, 'bin')} to your PATH to use this version`,
		)
	} catch (error) {
		console.error(`Error installing Gradle version ${version}:`, error)
		process.exit(1)
	}
}

/**
 * Lists installed Gradle versions
 */
async function listInstalledVersions(): Promise<void> {
	try {
		if (!existsSync(gradleBinDir)) {
			console.log('No Gradle versions installed.')
			return
		}

		const items = await $`ls -1 "${gradleBinDir}"`.text()
		const gradleVersions = items
			.split('\n')
			.filter(line => line.startsWith('gradle-'))
			.map(line => line.replace('gradle-', ''))
			.filter(version => version.length > 0)

		if (gradleVersions.length === 0) {
			console.log('No Gradle versions installed.')
			return
		}

		console.log('Installed Gradle versions:')
		gradleVersions.forEach(version => {
			console.log(`  ${version}`)
		})
	} catch (error) {
		console.error('Error listing installed versions:', error)
	}
}

/**
 * Checks for newer Gradle versions
 */
async function checkForUpdates(): Promise<void> {
	try {
		console.log('Checking for newer Gradle versions...')
		const latestVersion = await getLatestGradleVersion()
		console.log(`Latest Gradle version available: ${latestVersion}`)

		// Check what's installed
		if (!existsSync(gradleBinDir)) {
			console.log('No Gradle versions installed.')
			return
		}

		const items = await $`ls -1 "${gradleBinDir}"`.text()
		const installedVersions = items
			.split('\n')
			.filter(line => line.startsWith('gradle-'))
			.map(line => line.replace('gradle-', ''))
			.filter(version => version.length > 0)

		if (installedVersions.length === 0) {
			console.log(
				'No Gradle versions installed. Consider installing the latest version.',
			)
			return
		}

		// Simple version comparison (this could be improved)
		const needsUpdate = !installedVersions.includes(latestVersion)
		if (needsUpdate) {
			console.log(`A newer version (${latestVersion}) is available.`)
			console.log(`To install it, run: gim install ${latestVersion}`)
		} else {
			console.log('You are using the latest Gradle version.')
		}
	} catch (error) {
		console.error('Error checking for updates:', error)
	}
}

/**
 * Check current installed version and latest available version
 */
async function checkVersion(): Promise<void> {
	try {
		console.log('Checking Gradle versions...')

		// Get latest version from GitHub
		const latestVersion = await getLatestGradleVersion()
		console.log(`Latest Gradle version available: ${latestVersion}`)

		// Check what's installed
		if (!existsSync(gradleBinDir)) {
			console.log('No Gradle versions installed.')
			return
		}

		const items = await $`ls -1 "${gradleBinDir}"`.text()
		const installedVersions = items
			.split('\n')
			.filter(line => line.startsWith('gradle-'))
			.map(line => line.replace('gradle-', ''))
			.filter(version => version.length > 0)

		if (installedVersions.length === 0) {
			console.log('No Gradle versions installed.')
			return
		}

		console.log('Installed Gradle versions:')
		installedVersions.forEach(version => {
			console.log(`  ${version}`)
		})

		// Check if any installed version matches the latest
		const hasLatest = installedVersions.includes(latestVersion)
		if (hasLatest) {
			console.log(`You have the latest version (${latestVersion}) installed.`)
		} else {
			console.log(
				`You do not have the latest version (${latestVersion}) installed.`,
			)
			console.log(`To install it, run: gim install ${latestVersion}`)
		}
	} catch (error) {
		console.error('Error checking versions:', error)
	}
}

/**
 * Shows help information
 */
function showHelp(): void {
	console.log('Gradle Install Manager (gim)')
	console.log('')
	console.log('Usage:')
	console.log('  gim <command> [options]')
	console.log('')
	console.log('Commands:')
	console.log('  install <version>   Install a specific Gradle version')
	console.log('  list                List installed Gradle versions')
	console.log('  update              Check for newer Gradle versions')
	console.log('  checkversion        Check current and latest Gradle versions')
	console.log('  help                Show this help message')
	console.log('')
	console.log('Examples:')
	console.log('  gim install 8.5     Install Gradle version 8.5')
	console.log('  gim install latest  Install the latest Gradle version')
	console.log('  gim list            List all installed versions')
	console.log('  gim update          Check for available updates')
	console.log('  gim checkversion    Check current and latest versions')
}

/**
 * Main entry point
 */
async function main() {
	const args = process.argv.slice(2)

	if (args.length === 0) {
		showHelp()
		return
	}

	const command = args[0]

	switch (command) {
		case 'install': {
			const version = args[1] || 'latest'
			if (version === 'latest') {
				const latestVersion = await getLatestGradleVersion()
				await installGradleVersion(latestVersion)
			} else {
				await installGradleVersion(version)
			}
			break
		}

		case 'list': {
			await listInstalledVersions()
			break
		}

		case 'update': {
			await checkForUpdates()
			break
		}

		case 'help': {
			showHelp()
			break
		}

		case 'checkversion': {
			await checkVersion()
			break
		}

		default:
			console.log(`Unknown command: ${command}`)
			showHelp()
			process.exit(1)
	}
}

// Run the main function
main().catch(error => {
	console.error('Unexpected error:', error)
	process.exit(1)
})
